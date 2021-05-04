"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getPasswordFromPrompt_1 = require("../getPasswordFromPrompt");
var log_1 = require("../log");
var passwordSaveErrorHandler_1 = require("../passwordSaveErrorHandler");
var storePassword_1 = require("../storePassword");
var trackActivity_1 = require("../trackActivity");
function handleAlksDeveloperLogin(_options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var logger, password, err_1, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = 'dev-login';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, getPasswordFromPrompt_1.getPasswordFromPrompt()];
                case 2:
                    password = _a.sent();
                    log_1.log(program, logger, 'saving password');
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, storePassword_1.storePassword(password)];
                case 4:
                    _a.sent();
                    console.error(cli_color_1.default.white('Password saved!'));
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    log_1.log(program, logger, 'error saving password! ' + err_1.message);
                    passwordSaveErrorHandler_1.passwordSaveErrorHandler(err_1);
                    return [3 /*break*/, 6];
                case 6:
                    log_1.log(program, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity(logger)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin = handleAlksDeveloperLogin;
//# sourceMappingURL=alks-developer-login.js.map