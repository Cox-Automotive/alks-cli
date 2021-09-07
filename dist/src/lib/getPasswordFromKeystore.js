"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordFromKeystore = void 0;
var tslib_1 = require("tslib");
var getKeytar_1 = require("./getKeytar");
var SERVICE = 'alkscli';
var ALKS_USERID = 'alksuid';
function getPasswordFromKeystore() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 1:
                    keytar = _a.sent();
                    return [4 /*yield*/, keytar.getPassword(SERVICE, ALKS_USERID).catch(function () { return null; })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getPasswordFromKeystore = getPasswordFromKeystore;
//# sourceMappingURL=getPasswordFromKeystore.js.map