"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin2fa = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getDeveloper_1 = require("../getDeveloper");
var getPasswordFromPrompt_1 = require("../getPasswordFromPrompt");
var log_1 = require("../log");
var passwordSaveErrorHandler_1 = require("../passwordSaveErrorHandler");
var storeToken_1 = require("../storeToken");
var tractActivity_1 = require("../tractActivity");
var opn_1 = tslib_1.__importDefault(require("opn"));
function handleAlksDeveloperLogin2fa(_options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var logger, data, url, err_1, refreshToken, alks, err_2, err_3, err_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = 'dev-login-2fa';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 19, , 20]);
                    log_1.log(program, logger, 'loading developer');
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 2:
                    data = _a.sent();
                    console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
                    url = data.server.replace(/rest/, 'token-management');
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, opn_1.default(url)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error("Failed to open " + url);
                    console.error('Please open the url in the browser of your choice');
                    return [3 /*break*/, 6];
                case 6:
                    console.error('Please copy your refresh token from ALKS and paste below..');
                    return [4 /*yield*/, getPasswordFromPrompt_1.getPasswordFromPrompt('Refresh Token')];
                case 7:
                    refreshToken = _a.sent();
                    log_1.log(program, logger, 'exchanging refresh token for access token');
                    return [4 /*yield*/, getAlks_1.getAlks({
                            baseUrl: data.server,
                        })];
                case 8:
                    alks = _a.sent();
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, alks.getAccessToken({
                            refreshToken: refreshToken,
                        })];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 11:
                    err_2 = _a.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit('Error validating refresh token. ' + err_2.message)];
                case 12:
                    console.error(cli_color_1.default.white('Refresh token validated!'));
                    _a.label = 13;
                case 13:
                    _a.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, storeToken_1.storeToken(refreshToken)];
                case 14:
                    _a.sent();
                    console.error(cli_color_1.default.white('Refresh token saved!'));
                    return [3 /*break*/, 16];
                case 15:
                    err_3 = _a.sent();
                    log_1.log(program, logger, 'error saving token! ' + err_3.message);
                    passwordSaveErrorHandler_1.passwordSaveErrorHandler(err_3);
                    return [3 /*break*/, 16];
                case 16:
                    log_1.log(program, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, tractActivity_1.trackActivity(logger)];
                case 18:
                    _a.sent();
                    setTimeout(function () {
                        process.exit(0);
                    }, 1000); // needed for if browser is still open
                    return [3 /*break*/, 20];
                case 19:
                    err_4 = _a.sent();
                    errorAndExit_1.errorAndExit(err_4.message, err_4);
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin2fa = handleAlksDeveloperLogin2fa;
//# sourceMappingURL=alks-developer-login2fa.js.map