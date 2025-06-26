"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFavorites = void 0;
// Returns a number for a sorting function such that favorites are sorted to the top
const compareFavorites = (favorites) => (a, b) => Number(favorites.includes(b.account)) -
    Number(favorites.includes(a.account));
exports.compareFavorites = compareFavorites;
//# sourceMappingURL=compareFavorites.js.map