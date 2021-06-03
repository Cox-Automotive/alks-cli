import { getAccountRegex } from './getAccountRegex';

export function tryToExtractRole(account: string): string | undefined {
  let match;
  while ((match = getAccountRegex().exec(account))) {
    if (match && account.indexOf('ALKS_') === -1) {
      // ignore legacy accounts
      return match[4];
    }
  }
  return undefined;
}
