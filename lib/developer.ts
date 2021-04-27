/*jslint node: true */
'use strict';

import { isEmpty } from 'underscore';
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
let vAtSt: string | undefined;

export function getAccountDelim() {
  return delim;
}

export function getVersionAtStart() {
  return vAtSt;
}

async function getCollection<T extends object>(
  name: string
): Promise<Collection<T>> {
  return new Promise((resolve, reject) => {
    db.loadDatabase({}, (err: Error) => {
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

export async function getUseridFromPrompt(
  text?: string,
  currentUserid?: string
) {
  log(null, logger, 'getting userid from prompt');
  const answers = await getStdErrPrompt()([
    {
      type: 'input',
      name: 'userid',
      message: text ? text : 'Network Username',
      default() {
        return isEmpty(currentUserid) ? '' : currentUserid;
      },
      validate(val) {
        return !isEmpty(val)
          ? true
          : 'Please enter a value for network username.';
      },
    },
  ]);

  return trim(answers.userid);
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
    const auth = netrc(SERVICETKN);
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

export async function saveDeveloper(developer: NewDeveloper): Promise<void> {
  log(null, logger, 'saving developer');
  const collection: Collection<Developer> = await getCollection('account');

  collection.removeDataOnly();

  collection.insert({
    server: developer.server && trim(developer.server),
    userid: developer.userid && trim(developer.userid),
    alksAccount: developer.alksAccount && trim(developer.alksAccount),
    alksRole: developer.alksRole && trim(developer.alksRole),
    lastVersion: pkg.version,
    outputFormat: developer.outputFormat && trim(developer.outputFormat),
  });

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

export async function savePassword(password: string) {
  try {
    await storePassword(password);
  } catch (e) {
    passwordSaveErrorHandler(e);
  }
}

export interface BaseDeveloper {
  server: string;
  userid: string;
  alksAccount: string;
  alksRole: string;
  outputFormat: string;
}

export interface DeveloperMetadata {
  lastVersion: string;
}

export interface Developer extends BaseDeveloper, DeveloperMetadata {}

export interface NewDeveloper
  extends BaseDeveloper,
    Partial<DeveloperMetadata> {}

export async function getDeveloper(): Promise<Developer> {
  const collection: Collection<Developer> = await getCollection('account');

  const developerConfigs = collection.chain().data();
  if (developerConfigs.length === 0) {
    throw new Error(
      'Developer not configured. Please run `alks developer configure`'
    );
  }
  const developer = developerConfigs[0];

  if (process.env.ALKS_SERVER) {
    developer.server = process.env.ALKS_SERVER;
  }
  if (process.env.ALKS_USERID) {
    developer.userid = process.env.ALKS_USERID;
  }
  return developer;
}

export async function saveFavorites(data: {
  accounts: Favorites;
}): Promise<void> {
  log(null, logger, 'saving favorites');
  const favorites: Collection<Favorites> = await getCollection('favorites');

  favorites.removeDataOnly();

  favorites.insert(data.accounts);

  return new Promise((resolve, reject) => {
    db.save((err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export interface Favorites {
  favorites: string[];
}

export async function getFavorites(): Promise<string[]> {
  log(null, logger, 'retreiving favorites');
  const favorites: Collection<Favorites> = await getCollection('favorites');
  const data = favorites.chain().data()[0];
  if (data && data.favorites) {
    return data.favorites;
  } else {
    return [];
  }
}

export async function saveMetadata(data: Metadata): Promise<void> {
  log(null, logger, 'saving metadata');
  const md: Collection<Metadata> = await getCollection('metadata');
  md.removeDataOnly();

  md.insert(data);

  return new Promise((resolve, reject) => {
    db.save((err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export interface Metadata {
  isIam: boolean;
  alksAccount: string;
  alksRole: string;
}

export async function getMetadata(): Promise<Metadata> {
  log(null, logger, 'retreiving metadata');
  const md: Collection<Metadata> = await getCollection('metadata');
  const data = md.chain().data()[0];
  return data || [];
}

export interface GetAlksAccountProps {
  iamOnly: boolean;
  prompt: string;
  server?: string;
  filterFavorites: boolean;
}

export interface AlksAccountPromptData {
  type: string;
  name: string;
  message: string;
  choices: string[];
  pageSize: number;
  default?: string;
}

export async function getAlksAccount(
  program: commander.Command,
  options: Partial<GetAlksAccountProps>
): Promise<{ alksAccount: string; alksRole: string }> {
  log(program, logger, 'retreiving alks account');

  let developer: Developer | undefined;
  try {
    developer = await getDeveloper();
  } catch (e) {
    // It's ok if developer isn't set yet since this may be called during the initial setup
  }

  const opts: GetAlksAccountProps = {
    iamOnly: options.iamOnly || false,
    prompt: options.prompt || 'Please select an ALKS account/role',
    filterFavorites: options.filterFavorites || false,
    server: options.server || developer?.server,
  };

  if (!opts.server) {
    throw new Error('No server URL configured');
  }

  const auth = await getAuth(program);

  // load available account/roles
  const alks = await getAlks({
    baseUrl: opts.server,
    ...auth,
  });

  const alksAccounts = await alks.getAccounts();

  const favorites = await getFavorites();

  const indexedAlksAccounts = alksAccounts
    .filter((alksAccount) => !opts.iamOnly || alksAccount.iamKeyActive) // Filter out non-iam-active accounts if iamOnly flag is passed
    .filter(
      (alksAccount) =>
        !opts.filterFavorites || favorites.includes(alksAccount.account)
    ) // Filter out non-favorites if filterFavorites flag is passed
    .sort(
      (a, b) =>
        Number(favorites.includes(b.account)) -
        Number(favorites.includes(a.account))
    ) // Move favorites to the front of the list, non-favorites to the back
    .map((alksAccount) =>
      [alksAccount.account, alksAccount.role].join(getAccountDelim())
    );

  if (!indexedAlksAccounts.length) {
    throw new Error('No accounts found.');
  }

  const promptData: AlksAccountPromptData = {
    type: 'list',
    name: 'alksAccount',
    message: opts.prompt,
    choices: indexedAlksAccounts,
    pageSize: 15,
  };

  if (developer) {
    promptData.default = [developer.alksAccount, developer.alksRole].join(
      getAccountDelim()
    );
  }

  // ask user which account/role
  const prompt = getStdErrPrompt();
  const answers = await prompt([promptData]);

  const acctStr = answers.alksAccount;
  const data = acctStr.split(getAccountDelim());
  const alksAccount = data[0];
  const alksRole = data[1];

  return {
    alksAccount,
    alksRole,
  };
}

export interface TokenAuth {
  token: string;
}

export interface PasswordAuth {
  userid: string;
  password: string;
}

export type Auth = TokenAuth | PasswordAuth;
export function isTokenAuth(auth: Auth): auth is TokenAuth {
  return Boolean((auth as TokenAuth).token);
}

export async function getAuth(
  program: commander.Command,
  prompt: boolean = true
): Promise<Auth> {
  if (program.auth) {
    log(program, logger, 'using cached auth object');
    return program.auth;
  }

  log(program, logger, 'checking for access token');
  const token = await getToken();
  if (token) {
    const auth = { token };
    program.auth = auth;
    return auth;
  } else {
    log(program, logger, 'no access token found, falling back to password');
    const userid = await getUserid(program, prompt);
    const password = await getPassword(program, prompt);
    const auth = { userid, password };
    program.auth = auth;
    return auth;
  }
}

export async function getUserid(
  program: commander.Command,
  prompt: boolean = true
) {
  if (program && !isEmpty(program.userid)) {
    // first check userid from CLI argument
    log(program, logger, 'using userid from CLI arg');
    return program.userid;
  } else if (!isEmpty(process.env.ALKS_USERID)) {
    // then check for an environment variable
    log(program, logger, 'using userid from environment variable');
    return process.env.ALKS_USERID;
  } else {
    // then check for stored userid
    const developer = await getDeveloper();
    const userid = developer.userid;
    if (!isEmpty(userid)) {
      log(program, logger, 'using stored userid');
      return userid;
    } else if (prompt) {
      // otherwise prompt the user (if we have program)
      log(program, logger, 'no userid found, prompting user');
      return program ? getUseridFromPrompt() : null;
    } else {
      throw new Error('No userid was configured');
    }
  }
}

export async function getPassword(
  program: commander.Command | null,
  prompt: boolean = true
) {
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
    } else if (prompt) {
      // otherwise prompt the user (if we have program)
      log(program, logger, 'no password found, prompting user');
      return program ? getPasswordFromPrompt() : null;
    } else {
      throw new Error('No password was configured');
    }
  }
}

export async function trackActivity(logger: string) {
  if (!visitor) {
    const dev = await getDeveloper();
    log(null, logger, 'creating tracker for: ' + dev.userid);
    visitor = ua(GA_ID, String(dev.userid), {
      https: true,
      strictCidFormat: false,
    });
  }
  log(null, logger, 'tracking activity: ' + logger);
  visitor.event('activity', logger).send();
}
