"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeysCollection = void 0;
var tslib_1 = require("tslib");
var db_1 = require("./db");
function getKeysCollection() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var db;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.getDb()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            // have the DB load from disk
                            db.loadDatabase({}, function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                // grab the keys collection (if its null this is a new run, create the collection)
                                var keys = db.getCollection('keys') ||
                                    db.addCollection('keys', { indices: ['expires'] });
                                resolve(keys);
                            });
                        })];
            }
        });
    });
}
exports.getKeysCollection = getKeysCollection;
//# sourceMappingURL=getKeysCollection.js.map