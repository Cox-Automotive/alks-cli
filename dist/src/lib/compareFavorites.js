"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFavorites = void 0;
const getAccountDelim_1 = require("./getAccountDelim");
// Returns a number for a sorting function such that favorites are sorted to the top
// while maintaining alphabetical order within each group
const compareFavorites = (favorites) => (a, b) => {
    const aKey = [a.account, a.role].join((0, getAccountDelim_1.getAccountDelim)());
    const bKey = [b.account, b.role].join((0, getAccountDelim_1.getAccountDelim)());
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
exports.compareFavorites = compareFavorites;
//# sourceMappingURL=compareFavorites.js.map