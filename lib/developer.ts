/*jslint node: true */
'use strict';

import { isEmpty, isUndefined, extend } from 'underscore';
import loki from 'lokijs';
import c from 'clortho';
import netrc, { update } from 'node-netrc';
import { getAlks } from './alks';
import {
  getDBFile,
  isPasswordSecurelyStorable,
  log,
  getFilePathInHome,
  getOwnerRWOnlyPermission,
  getStdErrPrompt,
  trim,
  passwordSaveErrorHandler,
} from './utils';
import ua from 'universal-analytics';
import chmod from 'chmod';
import pkg from '../package.json';
import commander from 'commander';

const clortho = c.forService('alkscli');
const ALKS_USERID = 'alksuid';
const ALKS_TOKEN = 'alkstoken';
const SERVICE = 'alkscli';
const SERVICETKN = 'alksclitoken';
const GA_ID = 'UA-88747959-1';

const db = new loki(getDBFile());
let visitor: ua.Visitor | null = null;
const delim = ' :: ';
const logger = 'developer';
let vAtSt: string | null = null;

export function getAccountDelim() {
  return delim;
}

export function getVersionAtStart() {
  return vAtSt;
}

async function getCollection(name: string) {
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

export async function getPasswordFromKeystore() {
  if (isPasswordSecurelyStorable()) {
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
    if (!isEmpty(auth.password)) {
      return auth.password;
    } else {
      return null;
    }
  }
}

export async function storePassword(password: string) {
  log(null, logger, 'storing password');
  if (isPasswordSecurelyStorable()) {
    try {
      await clortho.saveToKeychain(ALKS_USERID, password);
    } catch (e) {
      return false;
    }
    return true;
  } else {
    update(SERVICE, {
      login: ALKS_USERID,
      password,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerRWOnlyPermission());

    return true;
  }
}

export async function removePassword() {
  log(null, logger, 'removing password');
  if (isPasswordSecurelyStorable()) {
    return clortho.removeFromKeychain(ALKS_USERID);
  } else {
    update(SERVICE, {});
  }
}

export async function getPasswordFromPrompt(
  text?: string,
  currentPassword?: string
) {
  log(null, logger, 'getting password from prompt');
  const answers = await getStdErrPrompt()([
    {
      type: 'password',
      name: 'password',
      message: text ? text : 'Password',
      default() {
        return isEmpty(currentPassword) ? '' : currentPassword;
      },
      validate(val) {
        return !isEmpty(val) ? true : 'Please enter a value for password.';
      },
    },
  ]);

  return trim(answers.password);
}

export async function storeToken(token: string) {
  log(null, logger, 'storing token');
  if (isPasswordSecurelyStorable()) {
    await clortho.saveToKeychain(ALKS_TOKEN, token);
  } else {
    update(SERVICETKN, {
      password: token,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerRWOnlyPermission());
  }
}

export async function removeToken() {
  log(null, logger, 'removing token');
  if (isPasswordSecurelyStorable()) {
    return clortho.removeFromKeychain(ALKS_TOKEN);
  } else {
    update(SERVICETKN, {});
  }
}

export async function getToken() {
  if (isPasswordSecurelyStorable()) {
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
    let auth = netrc(SERVICETKN);
    if (!isEmpty(auth.password)) {
      return auth.password;
    } else {
      return null;
    }
  }
}

export async function ensureConfigured() {
  const developer = await getDeveloper();
  if (!vAtSt) vAtSt = developer.lastVersion;

  // validate we have a valid configuration
  if (isEmpty(developer.server) || isEmpty(developer.userid)) {
    throw new Error(
      'ALKS CLI is not configured. Please run: alks developer configure'
    );
  }
}

export async function saveDeveloper(data: any): Promise<void> {
  log(null, logger, 'saving developer');
  const dev: any = await getCollection('account');

  dev.removeDataOnly();

  dev.insert({
    server: trim(data.server),
    userid: trim(data.userid),
    alksAccount: trim(data.alksAccount),
    alksRole: trim(data.alksRole),
    lastAcctUsed: data.lastAcctUsed, // dont trim, we need the space padding
    lastVersion: pkg.version,
    outputFormat: trim(data.outputFormat),
  });

  // if they supplied a password and want to save then store it
  if (data.savePassword && !isEmpty(data.password)) {
    try {
      await storePassword(data.password);
    } catch (e) {
      passwordSaveErrorHandler(e);
    }
  }

  // otherwise clear any previously stored passwords if they said no
  if (!isUndefined(data.savePassword) && !data.savePassword) {
    await removePassword();
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
}

export async function getDeveloper() {
  const dev: any = await getCollection('account');

  let data = dev.chain().data()[0];
  let resp = {
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
}

export async function saveFavorites(data: any): Promise<void> {
  log(null, logger, 'saving favorites');
  const favorites: any = await getCollection('favorites');

  favorites.removeDataOnly();

  favorites.insert(data.accounts);

  return new Promise((resolve, reject) => {
    db.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function getFavorites() {
  log(null, logger, 'retreiving favorites');
  const favorites: any = await getCollection('favorites');
  const data = favorites.chain().data()[0];
  if (data && data.favorites) {
    return data.favorites;
  } else {
    return [];
  }
}

export async function saveMetadata(data: any): Promise<void> {
  log(null, logger, 'saving metadata');
  const md: any = await getCollection('metadata');
  md.removeDataOnly();

  md.insert(data);

  return new Promise((resolve, reject) => {
    db.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function getMetadata() {
  log(null, logger, 'retreiving metadata');
  const md: any = await getCollection('metadata');
  let data = md.chain().data()[0];
  return data || [];
}

export async function getALKSAccount(program: commander.Command, options: any) {
  log(program, logger, 'retreiving alks account');
  let opts = extend(
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

  const developer = await getDeveloper();

  // setup defaults in case they are using this from `developer configure`
  if (!opts.server) opts.server = developer.server;
  if (!opts.userid) opts.userid = developer.userid;

  const auth = await getAuth(program);

  // load available account/roles
  const alks = await getAlks({
    baseUrl: opts.server,
    token: auth.token,
    userid: opts.userid,
    password: auth.password,
  });

  const alksAccounts = await alks.getAccounts();

  const favorites = await getFavorites();

  const indexedAlksAccounts = alksAccounts
    .filter((alksAccount) => !opts.iamOnly || alksAccount.iamKeyActive) // Filter out non-iam-active accounts if iamOnly flag is passed
    .filter(
      (alksAccount) => !opts.filterFavorites || favorites.contains(alksAccount)
    ) // Filter out non-favorites if filterFavorites flag is passed
    .sort((a, b) => favorites.includes(b) - favorites.includes(a)) // Move favorites to the front of the list, non-favorites to the back
    .map((alksAccount) =>
      [alksAccount.account, alksAccount.role].join(getAccountDelim())
    );

  if (!indexedAlksAccounts.length) {
    throw new Error('No accounts found.');
  }

  const promptData: any = {
    type: 'list',
    name: 'alksAccount',
    message: opts.prompt,
    choices: indexedAlksAccounts,
    pageSize: 15,
  };

  if (!opts.dontDefault) {
    promptData.default = developer.lastAcctUsed;
  }

  // ask user which account/role
  const answers = await getStdErrPrompt()([promptData]);

  const acctStr = answers.alksAccount;
  const data = acctStr.split(getAccountDelim());
  const alksAccount = data[0];
  const alksRole = data[1];

  developer.lastAcctUsed = acctStr; // remember what account they last used

  await saveDeveloper(developer);

  // dont set these until we save or theyll overwrite the user's default account
  developer.alksAccount = alksAccount;
  developer.alksRole = alksRole;

  return developer;
}

export async function getAuth(program: commander.Command) {
  let auth = {
    token: null,
    password: null,
  };

  if (program.auth) {
    log(program, logger, 'using cached auth object');
    return program.auth;
  }

  log(program, logger, 'checking for access token');
  const token = await getToken();
  if (token) {
    auth.token = token;
    return auth;
  } else {
    log(program, logger, 'no access token found, falling back to password');
    auth.password = await getPassword(program);
    return auth;
  }
}

export async function getPassword(program: commander.Command | null) {
  if (program && !isEmpty(program.password)) {
    // first check password from CLI argument
    log(program, logger, 'using password from CLI arg');
    return program.password;
  } else if (!isEmpty(process.env.ALKS_PASSWORD)) {
    // then check for an environment variable
    log(program, logger, 'using password from environment variable');
    return process.env.ALKS_PASSWORD;
  } else {
    // then check the keystore
    const password = await getPasswordFromKeystore();
    if (!isEmpty(password)) {
      log(program, logger, 'using password from keystore');
      return password;
    } else {
      // otherwise prompt the user (if we have program)
      log(program, logger, 'no password found, prompting user');
      return program ? getPasswordFromPrompt() : null;
    }
  }
}

export async function trackActivity(activity: any) {
  if (!visitor) {
    const dev = await getDeveloper();
    log(null, logger, 'creating tracker for: ' + dev.userid);
    visitor = ua(GA_ID, dev.userid, { https: true, strictCidFormat: false });
  }
  log(null, logger, 'tracking activity: ' + activity);
  visitor.event('activity', activity).send();
}
