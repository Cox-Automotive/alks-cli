"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForToken = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var open_1 = tslib_1.__importDefault(require("open"));
var getAlks_1 = require("./getAlks");
var getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
var getSecretFromStdin_1 = require("./getSecretFromStdin");
var log_1 = require("./log");
var server_1 = require("./state/server");
function promptForToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tokenFromStdin, server, url, err_1, refreshToken, alks, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSecretFromStdin_1.getSecretFromStdin()];
                case 1:
                    tokenFromStdin = _a.sent();
                    if (tokenFromStdin) {
                        return [2 /*return*/, tokenFromStdin];
                    }
                    return [4 /*yield*/, server_1.getServer()];
                case 2:
                    server = _a.sent();
                    if (!server) {
                        throw new Error('Server URL is not configured. Please run: alks developer configure');
                    }
                    console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
                    url = server.replace(/rest/, 'token-management');
                    console.error("If the 2FA page does not open, please visit " + cli_color_1.default.underline(url));
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, Promise.race([
                            open_1.default(url, {
                                newInstance: true,
                            }),
                            new Promise(function (_, rej) {
                                setTimeout(function () { return rej(); }, 5000);
                            }), // timeout after 5 seconds
                        ])];
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
                    log_1.log('exchanging refresh token for access token');
                    return [4 /*yield*/, getAlks_1.getAlks({})];
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
                    err_2.message = 'Error validating refresh token. ' + err_2.message;
                    throw err_2;
                case 12:
                    console.error(cli_color_1.default.white('Refresh token validated!'));
                    return [2 /*return*/, refreshToken];
            }
        });
    });
}
exports.promptForToken = promptForToken;
//# sourceMappingURL=promptForToken.js.map