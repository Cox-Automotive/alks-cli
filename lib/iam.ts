import { white } from 'cli-color';
import { isEmpty, last, sortBy, where } from 'underscore';
import { getAlks } from './alks';
import {
  ensureConfigured,
  getDeveloper,
  getAuth,
  getALKSAccount,
} from './developer';
import { getKeys, addKey } from './keys';
import { log, getBadAccountMessage } from './utils';
import moment from 'moment';
import commander from 'commander';

export async function getIAMKey(
  program: commander.Command,
  logger: string,
  alksAccount: string,
  alksRole: string,
  forceNewSession: boolean,
  filterFavorites: boolean
) {
  await ensureConfigured();

  log(program, logger, 'getting developer');
  const developer = await getDeveloper();

  log(program, logger, 'getting auth');
  const auth = await getAuth(program);

  // set auth so they dont get prompted again
  program.auth = auth;

  // only lookup alks account if they didnt provide
  if (isEmpty(alksAccount) || isEmpty(alksRole)) {
    log(program, logger, 'getting accounts');
    ({ alksAccount, alksRole } = await getALKSAccount(program, {
      iamOnly: true,
      filterFavorites,
    }));
  } else {
    log(program, logger, 'using provided account/role');
  }

  log(program, logger, 'getting existing keys');
  const existingKeys: any = await getKeys(auth, true);
  log(program, logger, 'got existing keys');

  if (existingKeys.length && !forceNewSession) {
    log(
      program,
      logger,
      'filtering keys by account/role - ' + alksAccount + ' - ' + alksRole
    );

    // filter keys for the selected alks account/role
    const keyCriteria = { alksAccount, alksRole };
    // filter, sort by expiration, grab last key to expire
    const selectedKey = last(
      sortBy(where(existingKeys, keyCriteria), 'expires')
    );

    if (selectedKey) {
      log(program, logger, 'found existing valid key');
      console.error(
        white.underline(
          ['Resuming existing session in', alksAccount, alksRole].join(' ')
        )
      );
      return selectedKey;
    }
  }

  // generate a new key/session
  if (forceNewSession) {
    log(program, logger, 'forcing a new session');
  }

  const alks = await getAlks({
    baseUrl: developer.server,
    token: auth.token,
    userid: developer.userid,
    password: auth.password,
  });

  const loginRole = await alks.getLoginRole({
    accountId: alksAccount.slice(0, 12),
    role: alksRole,
  });

  const duration = Math.min(loginRole.maxKeyDuration, 12);

  console.error(
    white.underline(
      ['Creating new session in', alksAccount, alksRole].join(' ')
    )
  );

  let key: any;
  try {
    key = await alks.getIAMKeys({
      account: alksAccount,
      role: alksRole,
      sessionTime: duration,
    });
  } catch (e) {
    throw new Error(getBadAccountMessage());
  }
  key.expires = moment().add(duration, 'hours');

  log(program, logger, 'storing key: ' + JSON.stringify(key));
  addKey(
    key.accessKey,
    key.secretKey,
    key.sessionToken,
    alksAccount,
    alksRole,
    key.expires,
    auth,
    true
  );

  return key;
}

export async function getIAMAccount(
  program: commander.Command,
  logger: string,
  alksAccount: string,
  alksRole: string,
  filterFavorites: boolean
) {
  await ensureConfigured();

  log(program, logger, 'getting developer');
  const developer = await getDeveloper();

  log(program, logger, 'getting auth');
  const auth = await getAuth(program);

  // set auth so they dont get prompted again
  program.auth = auth;

  // only lookup alks account if they didnt provide
  if (isEmpty(alksAccount) || isEmpty(alksRole)) {
    log(program, logger, 'getting accounts');
    ({ alksAccount, alksRole } = await getALKSAccount(program, {
      iamOnly: true,
      filterFavorites,
    }));
  } else {
    log(
      program,
      logger,
      'using provided account/role' + alksAccount + ' ' + alksRole
    );
  }

  return {
    developer,
    auth,
    account: alksAccount,
    role: alksRole,
  };
}
