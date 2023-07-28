"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFavorites = void 0;
const tslib_1 = require("tslib");
const log_1 = require("./log");
const getCollection_1 = require("./getCollection");
const db_1 = require("./db");
function saveFavorites(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('saving favorites');
        const favorites = yield (0, getCollection_1.getCollection)('favorites');
        favorites.removeDataOnly();
        favorites.insert(data.accounts);
        const db = yield (0, db_1.getDb)();
        return new Promise((resolve, reject) => {
            db.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
exports.saveFavorites = saveFavorites;
//# sourceMappingURL=saveFavorites.js.map