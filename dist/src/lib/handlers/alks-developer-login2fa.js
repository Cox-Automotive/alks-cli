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
var trackActivity_1 = require("../trackActivity");
var opn_1 = tslib_1.__importDefault(require("opn"));
function handleAlksDeveloperLogin2fa(_options, _program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, url, err_1, refreshToken, alks, err_2, err_3, err_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 18, , 19]);
                    log_1.log('loading developer');
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 1:
                    data = _a.sent();
                    console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
                    url = data.server.replace(/rest/, 'token-management');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, opn_1.default(url)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error("Failed to open " + url);
                    console.error('Please open the url in the browser of your choice');
                    return [3 /*break*/, 5];
                case 5:
                    console.error('Please copy your refresh token from ALKS and paste below..');
                    return [4 /*yield*/, getPasswordFromPrompt_1.getPasswordFromPrompt('Refresh Token')];
                case 6:
                    refreshToken = _a.sent();
                    log_1.log('exchanging refresh token for access token');
                    return [4 /*yield*/, getAlks_1.getAlks({
                            baseUrl: data.server,
                        })];
                case 7:
                    alks = _a.sent();
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, alks.getAccessToken({
                            refreshToken: refreshToken,
                        })];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _a.sent();
                    errorAndExit_1.errorAndExit('Error validating refresh token. ' + err_2.message);
                    return [3 /*break*/, 11];
                case 11:
                    console.error(cli_color_1.default.white('Refresh token validated!'));
                    _a.label = 12;
                case 12:
                    _a.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, storeToken_1.storeToken(refreshToken)];
                case 13:
                    _a.sent();
                    console.error(cli_color_1.default.white('Refresh token saved!'));
                    return [3 /*break*/, 15];
                case 14:
                    err_3 = _a.sent();
                    log_1.log('error saving token! ' + err_3.message);
                    passwordSaveErrorHandler_1.passwordSaveErrorHandler(err_3);
                    return [3 /*break*/, 15];
                case 15:
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 17:
                    _a.sent();
                    setTimeout(function () {
                        process.exit(0);
                    }, 1000); // needed for if browser is still open
                    return [3 /*break*/, 19];
                case 18:
                    err_4 = _a.sent();
                    errorAndExit_1.errorAndExit(err_4.message, err_4);
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin2fa = handleAlksDeveloperLogin2fa;
//# sourceMappingURL=alks-developer-login2fa.js.map