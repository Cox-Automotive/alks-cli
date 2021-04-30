"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = void 0;
var tslib_1 = require("tslib");
var getCollection_1 = require("./getCollection");
var log_1 = require("./log");
var logger = 'favorites';
function getFavorites() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var favorites, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(null, logger, 'retreiving favorites');
                    return [4 /*yield*/, getCollection_1.getCollection('favorites')];
                case 1:
                    favorites = _a.sent();
                    data = favorites.chain().data()[0];
                    if (data && data.favorites) {
                        return [2 /*return*/, data.favorites];
                    }
                    else {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getFavorites = getFavorites;
//# sourceMappingURL=getFavorites.js.map