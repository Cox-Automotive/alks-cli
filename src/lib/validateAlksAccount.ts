import { getAlksAccounts } from './getAlksAccounts';
import { getAwsAccountFromString } from './getAwsAccountFromString';

export async function validateAlksAccount(
  account: string,
  role: string
): Promise<void> {
  const alksAccounts = await getAlksAccounts();

  const awsAccount = await getAwsAccountFromString(account);
  if (!awsAccount) {
    throw new Error(
      `account: "${account}" could not be resolved to a valid AWS account`
    );
  }

  const matchingAccount = alksAccounts.find(
    (alksAccount) =>
      alksAccount.account.startsWith(awsAccount?.id) && alksAccount.role == role
  );

  if (!matchingAccount) {
    throw new Error(
      `account: "${account}" and role: "${role}" do not match any valid accounts`
    );
  }
}
