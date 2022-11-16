import { getAlks } from './getAlks';
import { getAuth } from './getAuth';
import { log } from './log';
import memoize from 'memoizee';

export interface GetAlksAccountRolePairsOptions {
  iamOnly?: boolean;
}

async function _getAlksAccounts(options: GetAlksAccountRolePairsOptions = {}) {
  log('refreshing alks accounts list');

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

const memoized = memoize(_getAlksAccounts, {
  maxAge: 5000,
});

export async function getAlksAccounts(
  options: GetAlksAccountRolePairsOptions = {}
) {
  log('retreiving alks accounts');

  return memoized(options) as ReturnType<typeof _getAlksAccounts>;
}
