import { Account } from 'alks.js';
import { ParsedAccount } from '../model/parsedAccount';

export const parseAlksAccount = (alksAccount: Account): ParsedAccount => {
  const [accountIdAndRole, accountAlias] = alksAccount.account.split(' - ');
  const [accountId, _accountRole] = accountIdAndRole.split('/');
  return { ...alksAccount, accountAlias, accountId, accountIdAndRole };
};
