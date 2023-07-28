"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeysCollection = void 0;
const tslib_1 = require("tslib");
const db_1 = require("./db");
function getKeysCollection() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        return new Promise((resolve, reject) => {
            // have the DB load from disk
            db.loadDatabase({}, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                // grab the keys collection (if its null this is a new run, create the collection)
                const keys = db.getCollection('keys') ||
                    db.addCollection('keys', { indices: ['expires'] });
                resolve(keys);
            });
        });
    });
}
exports.getKeysCollection = getKeysCollection;
//# sourceMappingURL=getKeysCollection.js.map