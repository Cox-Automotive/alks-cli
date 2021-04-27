/*jslint node: true */
'use strict';

const _ = require('underscore');
const loki = require('lokijs');
const clortho = require('clortho').forService('alkscli');
const netrc = require('node-netrc');
const path = require('path');
const Alks = require('./alks');
const utils = require('./utils');
const ua = require('universal-analytics');
const chmod = require('chmod');
const pkg = require(path.join(__dirname, '../', 'package.json'));

const ALKS_USERID = 'alksuid';
const ALKS_TOKEN = 'alkstoken';
const SERVICE = 'alkscli';
const SERVICETKN = 'alksclitoken';
const GA_ID = 'UA-88747959-1';

const db = new loki(utils.getDBFile());
let visitor = null;
const delim = ' :: ';
const logger = 'developer';
let vAtSt = null;

exports.getAccountDelim = function getAccountDelim() {
  return delim;
};

exports.getVersionAtStart = function getVersionAtStart() {
  return vAtSt;
};

async function getCollection(name) {
  return new Promise((resolve, reject) => {
    db.loadDatabase({}, (err) => {
      if (err) {
        reject(err);
        return;
      }

      const collection = db.getCollection(name) || db.addCollection(name);
      resolve(collection);
    });
  });
}

exports.getPasswordFromKeystore = async function getPasswordFromKeystore() {
  if (utils.isPasswordSecurelyStorable()) {
    try {
      const data = await clortho.getFromKeychain(ALKS_USERID);
      if (data) {
        return data.password;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else {
    const auth = netrc(SERVICE);
    if (!_.isEmpty(auth.password)) {
      return auth.password;
    } else {
      return null;
    }
  }
};

exports.storePassword = async function storePassword(password) {
  utils.log(null, logger, 'storing password');
  if (utils.isPasswordSecurelyStorable()) {
    try {
      await clortho.saveToKeychain(ALKS_USERID, password);
    } catch (e) {
      return false;
    }
    return true;
  } else {
    netrc.update(SERVICE, {
      login: ALKS_USERID,
      password: password,
    });

    chmod(utils.getFilePathInHome('.netrc'), utils.getOwnerRWOnlyPermission());

    return true;
  }
};

exports.removePassword = async function removePassword() {
  utils.log(null, logger, 'removing password');
  if (utils.isPasswordSecurelyStorable()) {
    return clortho.removeFromKeychain(ALKS_USERID);
  } else {
    netrc.update(SERVICE, {});
  }
};

exports.getPasswordFromPrompt = async function getPasswordFromPrompt(
  text,
  currentPassword
) {
  utils.log(null, logger, 'getting password from prompt');
  const answers = await utils.getStdErrPrompt()([
    {
      type: 'password',
      name: 'password',
      message: text ? text : 'Password',
      default: function () {
        return _.isEmpty(currentPassword) ? '' : currentPassword;
      },
      validate: function (val) {
        return !_.isEmpty(val) ? true : 'Please enter a value for password.';
      },
    },
  ]);

  return utils.trim(answers['password']);
};

exports.storeToken = async function storeToken(token) {
  utils.log(null, logger, 'storing token');
  if (utils.isPasswordSecurelyStorable()) {
    await clortho.saveToKeychain(ALKS_TOKEN, token);
  } else {
    netrc.update(SERVICETKN, {
      password: token,
    });

    chmod(utils.getFilePathInHome('.netrc'), utils.getOwnerRWOnlyPermission());
  }
};

exports.removeToken = async function removeToken() {
  utils.log(null, logger, 'removing token');
  if (utils.isPasswordSecurelyStorable()) {
    return clortho.removeFromKeychain(ALKS_TOKEN);
  } else {
    netrc.update(SERVICETKN, {});
  }
};

exports.getToken = async function getToken() {
  if (utils.isPasswordSecurelyStorable()) {
    try {
      const data = await clortho.getFromKeychain(ALKS_TOKEN);
      if (data) {
        return data.password;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else {
    var auth = netrc(SERVICETKN);
    if (!_.isEmpty(auth.password)) {
      return auth.password;
    } else {
      return null;
    }
  }
};

exports.ensureConfigured = async function ensureConfigured() {
  const developer = await exports.getDeveloper();
  if (!vAtSt) vAtSt = developer.lastVersion;

  // validate we have a valid configuration
  if (_.isEmpty(developer.server) || _.isEmpty(developer.userid)) {
    throw new Error(
      'ALKS CLI is not configured. Please run: alks developer configure'
    );
  }
};

exports.saveDeveloper = async function saveDeveloper(data) {
  utils.log(null, logger, 'saving developer');
  const dev = await getCollection('account');

  dev.removeDataOnly();

  dev.insert({
    server: utils.trim(data.server),
    userid: utils.trim(data.userid),
    alksAccount: utils.trim(data.alksAccount),
    alksRole: utils.trim(data.alksRole),
    lastAcctUsed: data.lastAcctUsed, // dont trim, we need the space padding
    lastVersion: pkg.version,
    outputFormat: utils.trim(data.outputFormat),
  });

  // if they supplied a password and want to save then store it
  if (data.savePassword && !_.isEmpty(data.password)) {
    try {
      await exports.storePassword(data.password);
    } catch (e) {
      utils.passwordSaveErrorHandler(err);
    }
  }

  // otherwise clear any previously stored passwords if they said no
  if (!_.isUndefined(data.savePassword) && !data.savePassword) {
    await exports.removePassword();
  }

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

exports.getDeveloper = async function getDeveloper() {
  const dev = await getCollection('account');

  var data = dev.chain().data()[0];
  var resp = {
    server: data ? data.server : null,
    userid: data ? data.userid : null,
    alksAccount: data ? data.alksAccount : null,
    alksRole: data ? data.alksRole : null,
    lastVersion: data ? data.lastVersion : null,
    lastAcctUsed: data ? data.lastAcctUsed : null,
    outputFormat: data ? data.outputFormat : null,
  };
  if (process.env.ALKS_SERVER) {
    resp.server = process.env.ALKS_SERVER;
  }
  if (process.env.ALKS_USERID) {
    resp.userid = process.env.ALKS_USERID;
  }
  return resp;
};

exports.saveFavorites = async function saveFavorites(data) {
  utils.log(null, logger, 'saving favorites');
  const favorites = await getCollection('favorites');

  favorites.removeDataOnly();

  favorites.insert(data.accounts);

  return new Promise((resolve, reject) => {
    db.save(function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.getFavorites = async function getFavorites() {
  utils.log(null, logger, 'retreiving favorites');
  const favorites = await getCollection('favorites');
  const data = favorites.chain().data()[0];
  if (data && data.favorites) {
    return data.favorites;
  } else {
    return [];
  }
};

exports.saveMetadata = async function saveMetadata(data) {
  utils.log(null, logger, 'saving metadata');
  const md = await getCollection('metadata');
  md.removeDataOnly();

  md.insert(data);

  return new Promise((resolve, reject) => {
    db.save(function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.getMetadata = async function getMetadata() {
  utils.log(null, logger, 'retreiving metadata');
  const md = await getCollection('metadata');
  var data = md.chain().data()[0];
  return data || [];
};

exports.getALKSAccount = async function getALKSAccount(program, options) {
  utils.log(program, logger, 'retreiving alks account');
  var opts = _.extend(
    {
      iamOnly: false,
      prompt: 'Please select an ALKS account/role',
      dontDefault: false,
      server: null,
      userid: null,
      filterFavorites: false,
    },
    options
  );

  const developer = await exports.getDeveloper();

  // setup defaults in case they are using this from `developer configure`
  if (!opts.server) opts.server = developer.server;
  if (!opts.userid) opts.userid = developer.userid;

  const auth = await exports.getAuth(program);

  // load available account/roles
  const alks = await Alks.getAlks({
    baseUrl: opts.server,
    token: auth.token,
    userid: opts.userid,
    password: auth.password,
  });

  const alksAccounts = await alks.getAccounts();

  const favorites = await exports.getFavorites();

  const indexedAlksAccounts = alksAccounts
    .filter((alksAccount) => !opts.iamOnly || alksAccount.iamKeyActive) // Filter out non-iam-active accounts if iamOnly flag is passed
    .filter(
      (alksAccount) => !opts.filterFavorites || favorites.contains(alksAccount)
    ) // Filter out non-favorites if filterFavorites flag is passed
    .sort((a, b) => favorites.includes(b) - favorites.includes(a)) // Move favorites to the front of the list, non-favorites to the back
    .map((alksAccount) =>
      [alksAccount.account, alksAccount.role].join(exports.getAccountDelim())
    );

  if (!indexedAlksAccounts.length) {
    throw new Error('No accounts found.');
  }

  const promptData = {
    type: 'list',
    name: 'alksAccount',
    message: opts.prompt,
    choices: indexedAlksAccounts,
    pageSize: 15,
  };

  if (!opts.dontDefault) {
    promptData['default'] = developer.lastAcctUsed;
  }

  // ask user which account/role
  const answers = await utils.getStdErrPrompt()([promptData]);

  const acctStr = answers.alksAccount;
  const data = acctStr.split(exports.getAccountDelim());
  const alksAccount = data[0];
  const alksRole = data[1];

  developer.lastAcctUsed = acctStr; // remember what account they last used

  await exports.saveDeveloper(developer);

  // dont set these until we save or theyll overwrite the user's default account
  developer.alksAccount = alksAccount;
  developer.alksRole = alksRole;

  return developer;
};

exports.getAuth = async function getAuth(program) {
  var auth = {
    token: null,
    password: null,
  };

  if (program.auth) {
    utils.log(program, logger, 'using cached auth object');
    return program.auth;
  }

  utils.log(program, logger, 'checking for access token');
  const token = await exports.getToken();
  if (token) {
    auth.token = token;
    return auth;
  } else {
    utils.log(
      program,
      logger,
      'no access token found, falling back to password'
    );
    auth.password = await exports.getPassword(program);
    return auth;
  }
};

exports.getPassword = async function getPassword(program) {
  if (program && !_.isEmpty(program.password)) {
    // first check password from CLI argument
    utils.log(program, logger, 'using password from CLI arg');
    return program.password;
  } else if (!_.isEmpty(process.env.ALKS_PASSWORD)) {
    // then check for an environment variable
    utils.log(program, logger, 'using password from environment variable');
    return process.env.ALKS_PASSWORD;
  } else {
    // then check the keystore
    const password = await exports.getPasswordFromKeystore();
    if (!_.isEmpty(password)) {
      utils.log(program, logger, 'using password from keystore');
      return password;
    } else {
      // otherwise prompt the user (if we have program)
      utils.log(program, logger, 'no password found, prompting user');
      return program ? exports.getPasswordFromPrompt() : null;
    }
  }
};

exports.trackActivity = async function trackActivity(activity) {
  function onComplete() {
    utils.log(null, logger, 'tracking activity: ' + activity);
    visitor.event('activity', activity).send();
  }

  if (!visitor) {
    const dev = await exports.getDeveloper();
    utils.log(null, logger, 'creating tracker for: ' + dev.userid);
    visitor = ua(GA_ID, dev.userid, { https: true, strictCidFormat: false });
  }
  onComplete();
};
