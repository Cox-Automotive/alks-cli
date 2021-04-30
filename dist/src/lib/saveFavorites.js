"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFavorites = void 0;
var tslib_1 = require("tslib");
var lokijs_1 = tslib_1.__importDefault(require("lokijs"));
var getDbFile_1 = require("./getDbFile");
var log_1 = require("./log");
var getCollection_1 = require("./getCollection");
var db = new lokijs_1.default(getDbFile_1.getDbFile());
var logger = 'favorites';
function saveFavorites(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var favorites;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(null, logger, 'saving favorites');
                    return [4 /*yield*/, getCollection_1.getCollection('favorites')];
                case 1:
                    favorites = _a.sent();
                    favorites.removeDataOnly();
                    favorites.insert(data.accounts);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db.save(function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        })];
            }
        });
    });
}
exports.saveFavorites = saveFavorites;
//# sourceMappingURL=saveFavorites.js.map