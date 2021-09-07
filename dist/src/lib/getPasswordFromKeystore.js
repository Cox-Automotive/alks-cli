"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordFromKeystore = void 0;
var tslib_1 = require("tslib");
var getKeytar_1 = require("./getKeytar");
var SERVICE = 'alkscli';
var ALKS_USERID = 'alksuid';
function getPasswordFromKeystore() {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 1:
                    keytar = _b.sent();
                    return [4 /*yield*/, keytar.getPassword(SERVICE, ALKS_USERID).catch(function () { return undefined; })];
                case 2: return [2 /*return*/, ((_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined)];
            }
        });
    });
}
exports.getPasswordFromKeystore = getPasswordFromKeystore;
//# sourceMappingURL=getPasswordFromKeystore.js.map