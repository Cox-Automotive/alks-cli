import commander from 'commander';
import { isEmpty } from 'underscore';
import { ensureConfigured } from './ensureConfigured';
import { getAlksAccount } from './getAlksAccount';
import { getAuth } from './getAuth';
import { getDeveloper } from './getDeveloper';
import { log } from './log';

export async function getIAMAccount(
  program: commander.Command,
  logger: string,
  alksAccount: string | undefined,
  alksRole: string | undefined,
  filterFavorites: boolean
) {
  await ensureConfigured();

  log(program, logger, 'getting developer');
  const developer = await getDeveloper();

  log(program, logger, 'getting auth');
  const auth = await getAuth(program);

  // only lookup alks account if they didnt provide
  if (isEmpty(alksAccount) || isEmpty(alksRole)) {
    log(program, logger, 'getting accounts');
    ({ alksAccount, alksRole } = await getAlksAccount(program, {
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
