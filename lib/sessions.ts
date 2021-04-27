/*jslint node: true */
'use strict';

import { white } from 'cli-color';
import { isEmpty, last, sortBy, where } from 'underscore';
import { getAlks } from './alks';
import { log, getBadAccountMessage } from '../lib/utils';
import { getKeys, addKey, Key } from './keys';
import {
  ensureConfigured,
  getDeveloper,
  getAuth,
  getAlksAccount,
} from './developer';
import moment from 'moment';
import commander from 'commander';
import ALKS from 'alks.js';

export async function getSessionKey(
  program: commander.Command,
  logger: string,
  alksAccount: string,
  alksRole: string,
  iamOnly: boolean,
  forceNewSession: boolean,
  filterFavorites: boolean
): Promise<Key> {
  await ensureConfigured();

  log(program, logger, 'getting developer');
  const developer = await getDeveloper();

  log(program, logger, 'getting auth');
  const auth = await getAuth(program);

  // only lookup alks account if they didnt provide
  if (isEmpty(alksAccount) || isEmpty(alksRole)) {
    log(program, logger, 'getting accounts');
    ({ alksAccount, alksRole } = await getAlksAccount(program, {
      iamOnly,
      filterFavorites,
    }));
  } else {
    log(program, logger, 'using provided account/role');
  }

  log(program, logger, 'getting existing keys');
  const existingKeys: Key[] = await getKeys(auth, false);

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
    ...auth,
  });

  const loginRole = await alks.getLoginRole({
    accountId: alksAccount.slice(0, 12),
    role: alksRole,
  });

  const duration = Math.min(loginRole.maxKeyDuration, 12);

  log(
    program,
    logger,
    'calling api to generate new keys/session for ' + duration + ' hours'
  );
  console.error(
    white.underline(
      ['Creating new session in', alksAccount, alksRole].join(' ')
    )
  );

  let alksKey: ALKS.Key;
  try {
    alksKey = await alks.getKeys({
      account: alksAccount,
      role: alksRole,
      sessionTime: duration,
    });
  } catch (e) {
    throw new Error(getBadAccountMessage());
  }
  const key: Key = {
    ...alksKey,
    expires: moment().add(duration, 'hours').toDate(),
    alksAccount,
    alksRole,
    isIAM: true,
  };

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
