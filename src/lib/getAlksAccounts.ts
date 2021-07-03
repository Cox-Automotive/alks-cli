import { getAlks } from './getAlks';
import { getAuth } from './getAuth';
import { log } from './log';

export interface GetAlksAccountRolePairsOptions {
  iamOnly?: boolean;
}

export async function getAlksAccounts(
  options: GetAlksAccountRolePairsOptions = {}
) {
  log('retreiving alks account');

  const auth = await getAuth();

  // load available account/roles
  const alks = await getAlks({
    ...auth,
  });

  const alksAccounts = await alks.getAccounts();
  log(
    `All accounts: ${alksAccounts.map((alksAccount) => alksAccount.account)}`
  );

  // Filter out non-iam-active accounts if iamOnly flag is passed
  const filteredAlksAccounts = alksAccounts.filter(
    (alksAccount) => !options.iamOnly || alksAccount.iamKeyActive
  );

  return filteredAlksAccounts;
}
