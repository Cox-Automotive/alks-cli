/*jslint node: true */
'use strict';

const loki = require('lokijs');
const _ = require('underscore');
const moment = require('moment');
const fs = require('fs');
const crypto = require('crypto');
const ini = require('prop-ini');
const clc = require('cli-color');
const lp = require('left-pad');
const utils = require('./utils');

const db = new loki(utils.getDBFile());

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const PART_CHAR = ':';
const IV_LEN = 16;
const ENC_LEN = 32;

function getSizedEncryptionKey(key) {
  // must be 256 bytes (32 characters)
  return lp(key, ENC_LEN, 0).substring(0, ENC_LEN);
}

function encrypt(text, key) {
  if (_.isEmpty(text)) {
    text = '';
  }

  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(getSizedEncryptionKey(key)),
    iv
  );
  const encd = Buffer.concat([cipher.update(text), cipher.final()]);

  return [iv.toString(ENCODING), encd.toString(ENCODING)].join(PART_CHAR);
}

function decrypt(text, key) {
  if (_.isEmpty(text)) {
    return '';
  }

  const parts = text.split(PART_CHAR);
  const iv = Buffer.from(parts.shift(), ENCODING);
  const encd = Buffer.from(parts.join(PART_CHAR), ENCODING);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(getSizedEncryptionKey(key)),
    iv
  );
  const decrypt = Buffer.concat([decipher.update(encd), decipher.final()]);

  return decrypt.toString();
}

async function getKeysCollection() {
  return new Promise((resolve, reject) => {
    // have the DB load from disk
    db.loadDatabase({}, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // grab the keys collection (if its null this is a new run, create the collection)
      const keys =
        db.getCollection('keys') ||
        db.addCollection('keys', { indices: ['expires'] });

      resolve(keys);
    });
  });
}

function updateCreds(key, profile, force) {
  const credPath = utils.getFilePathInHome('.aws');
  const credFile = credPath + '/credentials';

  // in case the user never ran `aws configure`..
  if (!fs.existsSync(credFile)) {
    if (!fs.existsSync(credPath)) {
      fs.mkdirSync(credPath);
    }
    fs.closeSync(fs.openSync(credFile, 'w'));
  }

  const propIni = ini.createInstance();
  const awsCreds = propIni.decode({ file: credFile });
  const section = profile || 'default';
  const accessKey = 'aws_access_key_id';
  const secretKey = 'aws_secret_access_key';
  const sessToken = 'aws_session_token';

  if (_.has(awsCreds.sections, section)) {
    if (force) {
      // overwrite only the relevant keys and leave the rest of the section untouched
      propIni.addData(key.accessKey, section, accessKey);
      propIni.addData(key.secretKey, section, secretKey);
      propIni.addData(key.sessionToken, section, sessToken);
    } else {
      return false;
    }
  } else {
    // add brand new section
    const data = {
      accessKey: key.accessKey,
      secretKey: key.secretKey,
      sessToken: key.sessionToken,
    };

    propIni.addData(data, section);
  }

  propIni.encode({ file: credFile });

  // propIni doesnt add a new line, so running aws configure will cause issues
  utils.addNewLineToEOF(credFile);

  return true;
}

exports.addKey = async function addKey(
  accessKey,
  secretKey,
  sessionToken,
  alksAccount,
  alksRole,
  expires,
  auth,
  isIAM
) {
  const enc = auth.token || auth.password;

  const keys = await getKeysCollection();

  keys.insert({
    accessKey: encrypt(accessKey, enc),
    secretKey: encrypt(secretKey, enc),
    sessionToken: encrypt(sessionToken, enc),
    alksAccount: encrypt(alksAccount, enc),
    alksRole: encrypt(alksRole, enc),
    isIAM: isIAM,
    expires: expires.toDate(),
  });

  return new Promise((resolve, reject) => {
    db.save(function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.getKeys = async function (auth, isIAM) {
  const keys = await getKeysCollection();
  const now = moment();
  const enc = auth.token || auth.password;

  // first delete any expired keys
  keys.removeWhere({ expires: { $lte: now.toDate() } });

  return new Promise((resolve, reject) => {
    // save the db to prune expired keys, wait for transaction to complete
    db.save((err) => {
      if (err) {
        reject(err);
        return;
      }

      // now get valid keys, decrypt their values and return
      const data = keys
        .chain()
        .find({ isIAM: { $eq: isIAM } })
        .simplesort('expires')
        .data();

      const dataOut = [];
      _.each(data, (keydata) => {
        // try catch here since we upgraded encryption and previously encrypted sessions will fail to decrypt
        try {
          keydata.accessKey = decrypt(keydata.accessKey, enc);
          keydata.secretKey = decrypt(keydata.secretKey, enc);
          keydata.sessionToken = decrypt(keydata.sessionToken, enc);
          keydata.alksAccount = decrypt(keydata.alksAccount, enc);
          keydata.alksRole = decrypt(keydata.alksRole, enc);
          keydata.isIAM = isIAM;
          dataOut.push(keydata);
        } catch (e) {
          // console.warn('Error decrypting session data.', e.message);
        }
      });

      resolve(dataOut);
    });
  });
};

// if adding new output types be sure to update utils.js:getOutputValues
exports.getKeyOutput = function getKeyOutput(format, key, profile, force) {
  // strip un-needed data
  ['meta', '$loki', 'isIAM', 'alksAccount', 'alksRole'].forEach((attr) => {
    delete key[attr];
  });

  const keyExpires = moment(key.expires).format();

  switch (format) {
    case 'docker': {
      return `-e AWS_ACCESS_KEY_ID=${key.accessKey} -e AWS_SECRET_ACCESS_KEY=${key.secretKey} -e AWS_SESSION_TOKEN= ${key.sessionToken} -e AWS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'terraformarg': {
      return `-e ALKS_ACCESS_KEY_ID=${key.accessKey} -e ALKS_SECRET_ACCESS_KEY=${key.secretKey} -e ALKS_SESSION_TOKEN=${key.sessionToken} -e ALKS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'tarraformenv': {
      const cmd = utils.isWindows() ? 'SET' : 'export';
      return `${cmd} ALKS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} ALKS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} ALKS_SESSION_TOKEN=${key.sessionToken} && ${cmd} ALKS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'json': {
      return JSON.stringify(key, null, 4);
    }
    case 'creds': {
      if (updateCreds(key, profile, force)) {
        const msg = 'Your AWS credentials file has been updated';

        if (profile) {
          msg += ` with the named profile: ${profile}`;
        }

        return msg;
      } else {
        return clc.red(
          `The ${profile} profile already exists in AWS credentials. Please pass -f to force overwrite.`
        );
      }
    }
    case 'idea': {
      return `AWS_ACCESS_KEY_ID=${key.accessKey}\nAWS_SECRET_ACCESS_KEY=${key.secretKey}\nAWS_SESSION_TOKEN=${key.sessionToken}\nAWS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'powershell': {
      return `$env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, $env:AWS_SESSION_TOKEN, $env:AWS_SESSION_EXPIRES = "${key.accessKey}","${key.secretKey}","${key.sessionToken}","${keyExpires}"`;
    }
    case 'fishshell': {
      return `set -xg AWS_ACCESS_KEY_ID '${key.accessKey}'; and set -xg AWS_SECRET_ACCESS_KEY '${key.secretKey}'; and set -xg AWS_SESSION_TOKEN '${key.sessionToken}'; and set -xg AWS_SESSION_EXPIRES '${keyExpires}';`;
    }
    case 'export': // fall through to case 'set'
    case 'set': {
      const cmd = format === 'export' ? 'export' : 'SET';

      return `${cmd} AWS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} AWS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} AWS_SESSION_TOKEN=${key.sessionToken} && ${cmd} AWS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'aws': {
      return JSON.stringify({
        Version: 1,
        AccessKeyId: key.accessKey,
        SecretAccessKey: key.secretKey,
        SessionToken: key.sessionToken,
        Expiration: moment(key.expires).toISOString(),
      });
    }
    default: {
      const cmd = utils.isWindows() ? 'SET' : 'export';

      return `${cmd} AWS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} AWS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} AWS_SESSION_TOKEN=${key.sessionToken} && ${cmd} AWS_SESSION_EXPIRES=${keyExpires}`;
    }
  }
};
