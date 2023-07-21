import clc from 'cli-color';
import commander from 'commander';
import { isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { tryToExtractRole } from '../tryToExtractRole';
import { unpackTags } from '../unpackTags';
import { getAwsAccountFromString } from '../getAwsAccountFromString';
import { badAccountMessage } from '../badAccountMessage';

export async function handleAlksIamUpdateRole(options: commander.OptionValues) {
  const roleName: string | undefined = options.rolename;
  if (!roleName) {
    errorAndExit('Must provide a valid role name');
  }

  let trustPolicy: Record<string, object> | undefined;
  try {
    trustPolicy = options.trustPolicy
      ? JSON.parse(options.trustPolicy)
      : undefined;
  } catch {
    errorAndExit('Error parsing trust policy. Must be valid JSON string');
  }

  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFavorites = options.favorites || false;
  const tags = options.tags ? unpackTags(options.tags) : undefined;

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

    log('calling api to update role: ' + roleName);

    const alks = await getAlks({
      ...auth,
    });

    let role;
    try {
      role = await alks.updateRole({
        account: awsAccount.id,
        role: alksRole,
        roleName,
        trustPolicy,
        tags,
      });
    } catch (err) {
      errorAndExit(err as Error);
    }

    console.log(
      clc.white(['The role: ', roleName, ' was updated successfully'])
    );
    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
