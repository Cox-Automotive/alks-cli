/*jslint node: true */
'use strict';

import loki from 'lokijs';
import { isEmpty, has, each } from 'underscore';
import moment from 'moment';
import { existsSync, mkdirSync, closeSync, openSync } from 'fs';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { createInstance } from 'prop-ini';
import { red } from 'cli-color';
import lp from 'left-pad';
import {
  getDBFile,
  getFilePathInHome,
  addNewLineToEOF,
  isWindows,
} from './utils';
import { Auth, isTokenAuth } from './developer';

const db = new loki(getDBFile());

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const PART_CHAR = ':';
const IV_LEN = 16;
const ENC_LEN = 32;

function getSizedEncryptionKey(key: string) {
  // must be 256 bytes (32 characters)
  return lp(key, ENC_LEN, 0).substring(0, ENC_LEN);
}

function encrypt(text: string, key: string) {
  if (isEmpty(text)) {
    text = '';
  }

  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(
    ALGORITHM,
    Buffer.from(getSizedEncryptionKey(key)),
    iv
  );
  const encd = Buffer.concat([cipher.update(text), cipher.final()]);

  return [iv.toString(ENCODING), encd.toString(ENCODING)].join(PART_CHAR);
}

function decrypt(text: string, key: string) {
  if (isEmpty(text)) {
    return '';
  }

  const parts = text.split(PART_CHAR);
  // Warning: if parts is empty, parts.shift() returns undefined and breaks Buffer.from(...)
  const iv = Buffer.from(parts.shift() as string, ENCODING);
  const encd = Buffer.from(parts.join(PART_CHAR), ENCODING);
  const decipher = createDecipheriv(
    ALGORITHM,
    Buffer.from(getSizedEncryptionKey(key)),
    iv
  );
  const decrypt = Buffer.concat([decipher.update(encd), decipher.final()]);

  return decrypt.toString();
}

export interface AwsKey {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
}

export interface Key extends AwsKey {
  alksAccount: string;
  alksRole: string;
  isIAM: boolean;
  expires: Date;
}

async function getKeysCollection(): Promise<Collection<Key>> {
  return new Promise((resolve, reject) => {
    // have the DB load from disk
    db.loadDatabase({}, (err?: Error) => {
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

function updateCreds(key: AwsKey, profile: string, force: boolean) {
  const credPath = getFilePathInHome('.aws');
  const credFile = credPath + '/credentials';

  // in case the user never ran `aws configure`..
  if (!existsSync(credFile)) {
    if (!existsSync(credPath)) {
      mkdirSync(credPath);
    }
    closeSync(openSync(credFile, 'w'));
  }

  const propIni = createInstance();
  const awsCreds = propIni.decode({ file: credFile });
  const section = profile || 'default';
  const accessKey = 'aws_access_key_id';
  const secretKey = 'aws_secret_access_key';
  const sessToken = 'aws_session_token';

  if (has(awsCreds.sections, section)) {
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
  addNewLineToEOF(credFile);

  return true;
}

export async function addKey(
  accessKey: string,
  secretKey: string,
  sessionToken: string,
  alksAccount: string,
  alksRole: string,
  expires: Date,
  auth: Auth,
  isIAM: boolean
): Promise<void> {
  const enc = isTokenAuth(auth) ? auth.token : auth.password;

  const keys = await getKeysCollection();

  keys.insert({
    accessKey: encrypt(accessKey, enc),
    secretKey: encrypt(secretKey, enc),
    sessionToken: encrypt(sessionToken, enc),
    alksAccount: encrypt(alksAccount, enc),
    alksRole: encrypt(alksRole, enc),
    isIAM,
    expires,
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
}

export async function getKeys(
  auth: Auth,
  isIAM: boolean
): Promise<(Key & LokiObj)[]> {
  const keys = await getKeysCollection();
  const now = moment();
  const enc = isTokenAuth(auth) ? auth.token : auth.password;

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

      const dataOut: (Key & LokiObj)[] = [];
      each(data, (keydata) => {
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
}

// if adding new output types be sure to update utils.js:getOutputValues
export function getKeyOutput(
  format: string,
  key: Key,
  profile: string,
  force: boolean
) {
  const keyExpires = moment(key.expires).format();

  switch (format) {
    case 'docker': {
      return `-e AWS_ACCESS_KEY_ID=${key.accessKey} -e AWS_SECRET_ACCESS_KEY=${key.secretKey} -e AWS_SESSION_TOKEN= ${key.sessionToken} -e AWS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'terraformarg': {
      return `-e ALKS_ACCESS_KEY_ID=${key.accessKey} -e ALKS_SECRET_ACCESS_KEY=${key.secretKey} -e ALKS_SESSION_TOKEN=${key.sessionToken} -e ALKS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'tarraformenv': {
      const cmd = isWindows() ? 'SET' : 'export';
      return `${cmd} ALKS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} ALKS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} ALKS_SESSION_TOKEN=${key.sessionToken} && ${cmd} ALKS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'json': {
      const keyData = {
        accessKey: key.accessKey,
        secretKey: key.secretKey,
        sessionToken: key.sessionToken,
        expires: key.expires, // This is the only format using the unformatted "key.expires". This may be a bug but I'm leaving it for the moment for backwards compatibility
      };
      return JSON.stringify(keyData, null, 4);
    }
    case 'creds': {
      if (updateCreds(key, profile, force)) {
        let msg = 'Your AWS credentials file has been updated';

        if (profile) {
          msg += ` with the named profile: ${profile}`;
        }

        return msg;
      } else {
        return red(
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
      const cmd = isWindows() ? 'SET' : 'export';

      return `${cmd} AWS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} AWS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} AWS_SESSION_TOKEN=${key.sessionToken} && ${cmd} AWS_SESSION_EXPIRES=${keyExpires}`;
    }
  }
}
