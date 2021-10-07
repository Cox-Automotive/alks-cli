import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksIamDeleteRole(options: commander.OptionValues) {
  const roleName = options.rolename;
  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFavorites = options.favorites || false;

  log('validating role name: ' + roleName);
  if (isEmpty(roleName)) {
    errorAndExit('The role name must be provided.');
  }

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (isEmpty(alksAccount) || isEmpty(alksRole)) {
      log('getting accounts');
      ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
        iamOnly: true,
        filterFavorites,
      }));
    } else {
      log('using provided account/role');
    }

    const auth = await getAuth();

    log('calling api to delete role: ' + roleName);

    const alks = await getAlks({
      ...auth,
    });

    try {
      await alks.deleteRole({
        account: alksAccount,
        role: alksRole,
        roleName,
      });
    } catch (err) {
      errorAndExit(err as Error);
    }

    console.log(clc.white(['The role ', roleName, ' was deleted'].join('')));
    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
