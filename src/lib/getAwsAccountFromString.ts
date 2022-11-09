import { getAlksAccounts } from './getAlksAccounts';
import { AwsAccount } from '../model/awsAccount';
import ALKS from 'alks.js';

/**
 * Gets an ALKS Account object from a user-provided account string. The user must have access to the account for it to be resolved
 *
 * @param accountString - a string uniquely identifying an AWS account that can take many forms, such as "012345678910/ALKSAdmin - awstest123", "012345678910/ALKSAdmin", "awstest123", or "012345678910"
 */
export async function getAwsAccountFromString(
  accountString: string
): Promise<AwsAccount | undefined> {
  const accounts = await getAlksAccounts();

  const accountId = (accountString.match(/^[0-9]{12}/) ?? [undefined])[0];

  // This alias regex was sourced from AWS's docs here -> https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateAccountAlias.html
  const alias = (accountString.match(
    /^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$/
  ) ?? [undefined])[0];

  let alksAccount: ALKS.Account | undefined;
  if (accountId) {
    // Get a list of accounts whose account string (e.g. "012345678910/ALKSAdmin - awstest123") starts with an account ID that matches the provided account ID
    const matchingAccounts = accounts.filter(
      (account) => accountId === account.account.substring(0, 12)
    );

    if (matchingAccounts.length > 0) {
      alksAccount = matchingAccounts[0];
    }
  } else if (alias) {
    // Get a list of accounts whose account string (e.g. "012345678910/ALKSAdmin - awstest123") contains an alias that matches the provided alias
    const matchingAccounts = accounts.filter(
      (account) =>
        account.account.match(new RegExp(` - ${alias}$`))?.length === 1
    );

    if (matchingAccounts.length > 0) {
      alksAccount = matchingAccounts[0];
    }
  }

  if (alksAccount) {
    return {
      id: alksAccount.account.substring(0, 12),
      alias: alksAccount.account.split(' - ')[1],
      label: alksAccount.skypieaAccount?.label,
    };
  }

  // if no matches or too many matches were found
  return undefined;
}
