import { ParsedAccount } from '../model/parsedAccount';
import { getAccountDelim } from './getAccountDelim';

// Output example: AccountName ..... AccountId/AccountRole    :: Role
export const formatAccountOutput = (
  alksAccount: ParsedAccount,
  maxAccountAliasLength: number,
  maxAccountIdAndRoleLength: number
): string => {
  return [
    `${alksAccount.accountAlias} .`.padEnd(maxAccountAliasLength + 2, '.'),
    alksAccount.accountIdAndRole.padEnd(maxAccountIdAndRoleLength, ' '),
    getAccountDelim(),
    alksAccount.role,
  ].join(' ');
};
