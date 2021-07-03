import { getAlksAccounts } from './getAlksAccounts';

export async function validateAlksAccount(
  account: string,
  role: string
): Promise<void> {
  const alksAccounts = await getAlksAccounts();

  const matchingAccount = alksAccounts.find(
    (alksAccount) => alksAccount.account == account && alksAccount.role == role
  );

  if (!matchingAccount) {
    throw new Error(
      `account: "${account}" and role: "${role}" do not match any valid accounts`
    );
  }
}
