"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFavorites = void 0;
const getAccountDelim_1 = require("./getAccountDelim");
// Returns a number for a sorting function such that favorites are sorted to the top
const compareFavorites = (favorites) => (a, b) => {
    const aKey = [a.account, a.role].join((0, getAccountDelim_1.getAccountDelim)());
    const bKey = [b.account, b.role].join((0, getAccountDelim_1.getAccountDelim)());
    return Number(favorites.includes(bKey)) - Number(favorites.includes(aKey));
};
exports.compareFavorites = compareFavorites;
//# sourceMappingURL=compareFavorites.js.map