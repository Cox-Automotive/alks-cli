import { white } from 'cli-color';
import { last, sortBy, where } from 'underscore';
import { getAlks } from './getAlks';
import moment from 'moment';
import ALKS from 'alks.js';
import { log } from './log';
import { badAccountMessage } from './badAccountMessage';
import { Key } from '../model/keys';
import { ensureConfigured } from './ensureConfigured';
import { getAuth } from './getAuth';
import { promptForAlksAccountAndRole } from './promptForAlksAccountAndRole';
import { getKeys } from './getKeys';
import { addKey } from './addKey';
import { getAwsAccountFromString } from './getAwsAccountFromString';

export async function getIamKey(
  alksAccount: string | undefined,
  alksRole: string | undefined,
  forceNewSession: boolean = false,
  filterFavorites: boolean = false,
  iamOnly: boolean = true,
  sessionDuration: number | undefined = undefined,
  ciid?: string,
  activityType?: string,
  description?: string
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

  const awsAccount = await getAwsAccountFromString(alksAccount);
  if (!awsAccount) {
    throw new Error(badAccountMessage);
  }

  log('getting existing keys');
  const existingKeys: Key[] = await getKeys(auth, true);
  log('got existing keys');

  if (existingKeys.length && !forceNewSession) {
    log(
      `filtering keys by ${awsAccount.id}(${awsAccount?.alias}) with role ${alksRole}`
    );

    // filter keys for the selected alks account/role
    const keyCriteria = { alksAccount: awsAccount.id, alksRole };
    // filter, sort by expiration, grab last key to expire
    const selectedKey = last(
      sortBy(where(existingKeys, keyCriteria), 'expires')
    );

    if (selectedKey) {
      log('found existing valid key');
      console.error(
        white.underline(
          `Resuming existing session in "${
            awsAccount.label ?? awsAccount.alias
          }" (id=${awsAccount.id} alias=${awsAccount.alias}) for ${alksRole}`
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
    accountId: awsAccount.id,
    role: alksRole,
  });

  const duration = Math.min(loginRole.maxKeyDuration, sessionDuration ?? 12);

  console.error(
    white.underline(
      `Creating new session in "${awsAccount.label ?? awsAccount.alias}" (id=${
        awsAccount.id
      } alias=${
        awsAccount.alias
      }) for ${alksRole} expiring in ${duration} hour${
        duration === 1 ? '' : 's'
      }`
    )
  );

  let alksKey: ALKS.Key;
  try {
    alksKey = await alks.getIAMKeys({
      account: awsAccount.id,
      role: alksRole,
      sessionTime: duration,
      primaryCI: ciid,
      category: activityType,
      description,
    });
  } catch (e) {
    throw new Error(badAccountMessage);
  }
  const key: Key = {
    accessKey: alksKey.accessKey,
    secretKey: alksKey.secretKey,
    sessionToken: alksKey.sessionToken,
    changeNumber: alksKey.changeRequestNumber,
    expires: moment().add(duration, 'hours').toDate(),
    alksAccount: awsAccount.id,
    alksRole,
    isIAM: true,
  };

  log('storing key: ' + JSON.stringify(key), {
    unsafe: true,
    alt: 'storing key',
  });
  await addKey(
    key.accessKey,
    key.secretKey,
    key.sessionToken,
    awsAccount.id,
    alksRole,
    key.expires,
    auth,
    true
  );

  return key;
}
