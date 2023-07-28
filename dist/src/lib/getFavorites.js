"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = void 0;
const tslib_1 = require("tslib");
const getCollection_1 = require("./getCollection");
const log_1 = require("./log");
function getFavorites() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('retreiving favorites');
        const favorites = yield (0, getCollection_1.getCollection)('favorites');
        const data = favorites.chain().data()[0];
        if (data && data.favorites) {
            return data.favorites;
        }
        else {
            return [];
        }
    });
}
exports.getFavorites = getFavorites;
//# sourceMappingURL=getFavorites.js.map