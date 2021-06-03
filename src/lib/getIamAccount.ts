import commander from 'commander';
import { isEmpty } from 'underscore';
import { ensureConfigured } from './ensureConfigured';
import { getAlksAccount } from './getAlksAccount';
import { getAuth } from './getAuth';
import { getDeveloper } from './getDeveloper';
import { log } from './log';

export async function getIAMAccount(
  program: commander.Command,
  alksAccount: string | undefined,
  alksRole: string | undefined,
  filterFavorites: boolean
) {
  await ensureConfigured();

  log('getting developer');
  const developer = await getDeveloper();

  log('getting auth');
  const auth = await getAuth(program);

  // only lookup alks account if they didnt provide
  if (isEmpty(alksAccount) || isEmpty(alksRole)) {
    log('getting accounts');
    ({ alksAccount, alksRole } = await getAlksAccount(program, {
      iamOnly: true,
      filterFavorites,
    }));
  } else {
    log('using provided account/role' + alksAccount + ' ' + alksRole);
  }

  return {
    developer,
    auth,
    account: alksAccount,
    role: alksRole,
  };
}
