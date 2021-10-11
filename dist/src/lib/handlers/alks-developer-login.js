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
function handleAlksDeveloperLogin(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var userId, password, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 1:
                    userId = _a.sent();
                    log_1.log('saving user ID');
                    return [4 /*yield*/, userId_1.setUserId(userId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 3:
                    password = _a.sent();
                    log_1.log('saving password');
                    return [4 /*yield*/, password_1.setPassword(password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin = handleAlksDeveloperLogin;
//# sourceMappingURL=alks-developer-login.js.map