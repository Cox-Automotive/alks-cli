import { ParsedAccount } from '../model/parsedAccount';

export const compareAliasesAlphabetically =
  () =>
  (a: ParsedAccount, b: ParsedAccount): number =>
    a.accountAlias.localeCompare(b.accountAlias);
