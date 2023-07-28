import { OptionValues } from 'commander';
import { AwsAccount } from '../model/awsAccount';
import { isUndefined } from 'underscore';
import { log } from './log';
import { tryToExtractRole } from './tryToExtractRole';
import { promptForAlksAccountAndRole } from './promptForAlksAccountAndRole';
import { getAwsAccountFromString } from './getAwsAccountFromString';
import { badAccountMessage } from './badAccountMessage';

/**
 * Gets an AwsAccount object and a role name from the provided options. If options are missing, it asks the user to select them
 *
 * @param options - the commander options object
 * @returns an account and role pair
 */
export async function extractAccountAndRole(
  options: OptionValues
): Promise<{ awsAccount: AwsAccount; role: string }> {
  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFavorites = options.favorites || false;

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  if (!alksAccount || !alksRole) {
    log('getting accounts');
    ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
      iamOnly: true,
      filterFavorites,
    }));
  } else {
    log('using provided account/role');
  }

  const awsAccount = await getAwsAccountFromString(alksAccount);
  if (!awsAccount) {
    throw new Error(badAccountMessage);
  }

  return {
    awsAccount,
    role: alksRole,
  };
}
