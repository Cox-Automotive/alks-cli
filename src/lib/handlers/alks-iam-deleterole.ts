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
import { getAwsAccountFromString } from '../getAwsAccountFromString';
import { badAccountMessage } from '../badAccountMessage';

export async function handleAlksIamDeleteRole(options: commander.OptionValues) {
  const roleName = options.rolename;
  let alksAccount = options.account as string | undefined;
  let alksRole = options.role as string | undefined;
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
    if (!alksAccount || !alksRole) {
      log('getting accounts');
      ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
        iamOnly: true,
        filterFavorites,
      }));
    } else {
      log('using provided account/role');
    }

    const auth = await getAuth();

    const awsAccount = await getAwsAccountFromString(alksAccount);
    if (!awsAccount) {
      throw new Error(badAccountMessage);
    }

    log('calling api to delete role: ' + roleName);

    const alks = await getAlks({
      ...auth,
    });

    try {
      await alks.deleteRole({
        account: awsAccount.id,
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
