"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = void 0;
const tslib_1 = require("tslib");
const db_1 = require("./db");
function getCollection(name) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        return new Promise((resolve, reject) => {
            db.loadDatabase({}, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const collection = db.getCollection(name) || db.addCollection(name);
                resolve(collection);
            });
        });
    });
}
exports.getCollection = getCollection;
//# sourceMappingURL=getCollection.js.map