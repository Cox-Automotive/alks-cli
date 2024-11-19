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

  // log the accounts, but truncate to show up to the first 10 accounts
  let accountsToLog = alksAccounts.map((alksAccount) => alksAccount.account);
  if (accountsToLog.length > 10) {
    accountsToLog = accountsToLog
      .slice(0, 10)
      .concat(`... and ${accountsToLog.length - 10} more`);
  }
  log(`All accounts: [${accountsToLog.join(', ')}]`);

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
