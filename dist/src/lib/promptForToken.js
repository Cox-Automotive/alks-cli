"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForToken = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var open_1 = tslib_1.__importDefault(require("open"));
var getAlks_1 = require("./getAlks");
var getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
var log_1 = require("./log");
var server_1 = require("./state/server");
function promptForToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var server, url, err_1, refreshToken, alks, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server_1.getServer()];
                case 1:
                    server = _a.sent();
                    if (!server) {
                        throw new Error('Server URL is not configured. Please run: alks developer configure');
                    }
                    console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
                    url = server.replace(/rest/, 'token-management');
                    console.error("If the 2FA page does not open, please visit " + cli_color_1.default.underline(url));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, Promise.race([
                            open_1.default(url, {
                                newInstance: true,
                            }),
                            new Promise(function (_, rej) {
                                setTimeout(function () { return rej(); }, 5000);
                            }), // timeout after 5 seconds
                        ])];
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
                    return [4 /*yield*/, getAlks_1.getAlks({})];
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
                    err_2.message = 'Error validating refresh token. ' + err_2.message;
                    throw err_2;
                case 11:
                    console.error(cli_color_1.default.white('Refresh token validated!'));
                    return [2 /*return*/, refreshToken];
            }
        });
    });
}
exports.promptForToken = promptForToken;
//# sourceMappingURL=promptForToken.js.map