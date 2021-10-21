"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin = void 0;
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var log_1 = require("../log");
var promptForPassword_1 = require("../promptForPassword");
var promptForUserId_1 = require("../promptForUserId");
var password_1 = require("../state/password");
var userId_1 = require("../state/userId");
function handleAlksDeveloperLogin(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var userId, _b, password, err_1;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    if (!((_a = options.username) !== null && _a !== void 0)) return [3 /*break*/, 1];
                    _b = _a;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 2:
                    _b = (_c.sent());
                    _c.label = 3;
                case 3:
                    userId = _b;
                    log_1.log('saving user ID');
                    return [4 /*yield*/, userId_1.setUserId(userId)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 5:
                    password = _c.sent();
                    log_1.log('saving password');
                    return [4 /*yield*/, password_1.setPassword(password)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _c.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin = handleAlksDeveloperLogin;
//# sourceMappingURL=alks-developer-login.js.map