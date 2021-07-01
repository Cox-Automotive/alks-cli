"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin = void 0;
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getPasswordFromPrompt_1 = require("../getPasswordFromPrompt");
var log_1 = require("../log");
var savePassword_1 = require("../savePassword");
var trackActivity_1 = require("../trackActivity");
function handleAlksDeveloperLogin(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var password, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getPasswordFromPrompt_1.getPasswordFromPrompt()];
                case 1:
                    password = _a.sent();
                    log_1.log('saving password');
                    return [4 /*yield*/, savePassword_1.savePassword(password)];
                case 2:
                    _a.sent();
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin = handleAlksDeveloperLogin;
//# sourceMappingURL=alks-developer-login.js.map