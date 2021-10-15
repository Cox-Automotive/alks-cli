"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = void 0;
var tslib_1 = require("tslib");
var db_1 = require("./db");
function getCollection(name) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var db;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.getDb()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db.loadDatabase({}, function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                var collection = db.getCollection(name) || db.addCollection(name);
                                resolve(collection);
                            });
                        })];
            }
        });
    });
}
exports.getCollection = getCollection;
//# sourceMappingURL=getCollection.js.map