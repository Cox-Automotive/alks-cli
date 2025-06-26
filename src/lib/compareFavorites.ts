import { Account } from 'alks.js';

// Returns a number for a sorting function such that favorites are sorted to the top
export const compareFavorites =
  (favorites: string[]) =>
  (a: Account, b: Account): number =>
    Number(favorites.includes(b.account)) -
    Number(favorites.includes(a.account));
