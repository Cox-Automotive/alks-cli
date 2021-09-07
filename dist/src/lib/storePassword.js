"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePassword = void 0;
var tslib_1 = require("tslib");
var log_1 = require("./log");
var getKeytar_1 = require("./getKeytar");
var SERVICE = 'alkscli';
var ALKS_USERID = 'alksuid';
function storePassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('storing password');
                    return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 1:
                    keytar = _a.sent();
                    return [4 /*yield*/, keytar.setPassword(SERVICE, ALKS_USERID, password)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.storePassword = storePassword;
//# sourceMappingURL=storePassword.js.map