"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
var tslib_1 = require("tslib");
var getDbFile_1 = require("./getDbFile");
var lokijs_1 = tslib_1.__importDefault(require("lokijs"));
var db;
function getDb() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!db) return [3 /*break*/, 2];
                    _a = lokijs_1.default.bind;
                    return [4 /*yield*/, getDbFile_1.getDbFile()];
                case 1:
                    db = new (_a.apply(lokijs_1.default, [void 0, _b.sent()]))();
                    _b.label = 2;
                case 2: return [2 /*return*/, db];
            }
        });
    });
}
exports.getDb = getDb;
//# sourceMappingURL=db.js.map