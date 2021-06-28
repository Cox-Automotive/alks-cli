import { white } from 'cli-color';
import { last, sortBy, where } from 'underscore';
import { getAlks } from './getAlks';
import moment from 'moment';
import ALKS from 'alks.js';
import { log } from './log';
import { getBadAccountMessage } from './getBadAccountMessage';
import { Key } from '../model/keys';
import { ensureConfigured } from './ensureConfigured';
import { getAuth } from './getAuth';
import { promptForAlksAccountAndRole } from './promptForAlksAccountAndRole';
import { getKeys } from './getKeys';
import { addKey } from './addKey';

export async function getSessionKey(
  alksAccount: string | undefined,
  alksRole: string | undefined,
  iamOnly: boolean,
  forceNewSession: boolean,
  filterFavorites: boolean
): Promise<Key> {
  await ensureConfigured();

  log('getting auth');
  const auth = await getAuth();

  // only lookup alks account if they didnt provide
  if (!alksAccount || !alksRole) {
    log('getting accounts');
    ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
      iamOnly,
      filterFavorites,
    }));
  } else {
    log('using provided account/role');
  }

  log('getting existing keys');
  const existingKeys: Key[] = await getKeys(auth, false);

  if (existingKeys.length && !forceNewSession) {
    log('filtering keys by account/role - ' + alksAccount + ' - ' + alksRole);

    // filter keys for the selected alks account/role
    const keyCriteria = { alksAccount, alksRole };
    // filter, sort by expiration, grab last key to expire
    const selectedKey = last(
      sortBy(where(existingKeys, keyCriteria), 'expires')
    );

    if (selectedKey) {
      log('found existing valid key');
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
    log('forcing a new session');
  }

  const alks = await getAlks({
    ...auth,
  });

  const loginRole = await alks.getLoginRole({
    accountId: alksAccount.slice(0, 12),
    role: alksRole,
  });

  const duration = Math.min(loginRole.maxKeyDuration, 12);

  log('calling api to generate new keys/session for ' + duration + ' hours');
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

  log('storing key: ' + JSON.stringify(key));
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
