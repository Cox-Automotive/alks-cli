"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePassword = void 0;
var tslib_1 = require("tslib");
var log_1 = require("./log");
var getKeytar_1 = require("./getKeytar");
var SERVICE = 'alkscli';
var ALKS_PASSWORD = 'alkspassword';
function removePassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('removing password');
                    return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 1:
                    keytar = _a.sent();
                    keytar.deletePassword(SERVICE, ALKS_PASSWORD);
                    return [2 /*return*/];
            }
        });
    });
}
exports.removePassword = removePassword;
//# sourceMappingURL=removePassword.js.map