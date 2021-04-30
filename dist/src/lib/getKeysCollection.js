"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeysCollection = void 0;
var tslib_1 = require("tslib");
var lokijs_1 = tslib_1.__importDefault(require("lokijs"));
var getDbFile_1 = require("./getDbFile");
var db = new lokijs_1.default(getDbFile_1.getDbFile());
function getKeysCollection() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
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
        });
    });
}
exports.getKeysCollection = getKeysCollection;
//# sourceMappingURL=getKeysCollection.js.map