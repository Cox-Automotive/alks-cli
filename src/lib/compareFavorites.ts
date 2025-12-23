import { Account } from 'alks.js';
import { getAccountDelim } from './getAccountDelim';
import { ParsedAccount } from '../model/parsedAccount';

// Returns a number for a sorting function such that favorites are sorted to the top
// while maintaining alphabetical order within each group
export const compareFavorites =
  (favorites: string[]) =>
  (a: Account | ParsedAccount, b: Account | ParsedAccount): number => {
    const aKey = [a.account, a.role].join(getAccountDelim());
    const bKey = [b.account, b.role].join(getAccountDelim());
    const aIsFavorite = favorites.includes(aKey);
    const bIsFavorite = favorites.includes(bKey);

    // If one is favorite and the other is not, sort favorites first
    if (aIsFavorite !== bIsFavorite) {
      return Number(bIsFavorite) - Number(aIsFavorite);
    }

    // If both are favorites or both are non-favorites, maintain alphabetical order
    const aAlias = 'accountAlias' in a ? a.accountAlias : a.account;
    const bAlias = 'accountAlias' in b ? b.accountAlias : b.account;
    return aAlias.localeCompare(bAlias);
  };
