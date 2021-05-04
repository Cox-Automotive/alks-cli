import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAlksAccount } from '../getAlksAccount';
import { getAuth } from '../getAuth';
import { getDeveloper } from '../getDeveloper';
import { log } from '../log';
import { trackActivity } from '../trackActivity';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksIamDeleteRole(
  options: commander.OptionValues,
  program: commander.Command
) {
  const logger = 'iam-delete';

  const roleName = options.rolename;
  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFavorites = options.favorites || false;

  log(program, logger, 'validating role name: ' + roleName);
  if (isEmpty(roleName)) {
    errorAndExit('The role name must be provided.');
  }

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log(program, logger, 'trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (isEmpty(alksAccount) || isEmpty(alksRole)) {
      log(program, logger, 'getting accounts');
      ({ alksAccount, alksRole } = await getAlksAccount(program, {
        iamOnly: true,
        filterFavorites,
      }));
    } else {
      log(program, logger, 'using provided account/role');
    }

    const developer = await getDeveloper();

    const auth = await getAuth(program);

    log(program, logger, 'calling api to delete role: ' + roleName);

    const alks = await getAlks({
      baseUrl: developer.server,
      ...auth,
    });

    try {
      await alks.deleteRole({
        account: alksAccount,
        role: alksRole,
        roleName,
      });
    } catch (err) {
      return errorAndExit(err);
    }

    console.log(clc.white(['The role ', roleName, ' was deleted'].join('')));
    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
