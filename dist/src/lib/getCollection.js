"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = void 0;
var tslib_1 = require("tslib");
var db_1 = require("./db");
function getCollection(name) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var db = db_1.getDb();
                    db.loadDatabase({}, function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        var collection = db.getCollection(name) || db.addCollection(name);
                        resolve(collection);
                    });
                })];
        });
    });
}
exports.getCollection = getCollection;
//# sourceMappingURL=getCollection.js.map