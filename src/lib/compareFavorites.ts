import { Account } from 'alks.js';
import { getAccountDelim } from './getAccountDelim';

// Returns a number for a sorting function such that favorites are sorted to the top
export const compareFavorites =
  (favorites: string[]) =>
  (a: Account, b: Account): number => {
    const aKey = [a.account, a.role].join(getAccountDelim());
    const bKey = [b.account, b.role].join(getAccountDelim());
    return Number(favorites.includes(bKey)) - Number(favorites.includes(aKey));
  };
