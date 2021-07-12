"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsConsole = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getIamKey_1 = require("../getIamKey");
var getSessionKey_1 = require("../getSessionKey");
var getUserAgentString_1 = require("../getUserAgentString");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
var alks_node_1 = tslib_1.__importDefault(require("alks-node"));
var open_1 = tslib_1.__importDefault(require("open"));
var alksAccount_1 = require("../state/alksAccount");
var alksRole_1 = require("../state/alksRole");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
function handleAlksSessionsConsole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccount, alksRole, forceNewSession, useDefaultAcct, filterFaves, err_1, key_1, err_2, url, opts, err_3, err_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    alksAccount = options.account;
                    alksRole = options.role;
                    forceNewSession = options.newSession;
                    useDefaultAcct = options.default;
                    filterFaves = options.favorites || false;
                    if (!underscore_1.isUndefined(alksAccount) && underscore_1.isUndefined(alksRole)) {
                        log_1.log('trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 23, , 24]);
                    if (!useDefaultAcct) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, alksAccount_1.getAlksAccount()];
                case 3:
                    alksAccount = _a.sent();
                    return [4 /*yield*/, alksRole_1.getAlksRole()];
                case 4:
                    alksRole = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    errorAndExit_1.errorAndExit('Unable to load default account!', err_1);
                    return [3 /*break*/, 6];
                case 6:
                    _a.trys.push([6, 11, , 12]);
                    if (!underscore_1.isUndefined(options.iam)) return [3 /*break*/, 8];
                    return [4 /*yield*/, getSessionKey_1.getSessionKey(alksAccount, alksRole, false, forceNewSession, filterFaves)];
                case 7:
                    key_1 = _a.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, getIamKey_1.getIamKey(alksAccount, alksRole, forceNewSession, filterFaves)];
                case 9:
                    key_1 = _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_2 = _a.sent();
                    errorAndExit_1.errorAndExit(err_2);
                    return [3 /*break*/, 12];
                case 12:
                    log_1.log('calling aws to generate 15min console URL');
                    return [4 /*yield*/, new Promise(function (resolve) {
                            alks_node_1.default.generateConsoleUrl(key_1, { debug: options.verbose, ua: getUserAgentString_1.getUserAgentString() }, function (err, consoleUrl) {
                                if (err) {
                                    errorAndExit_1.errorAndExit(err.message, err);
                                }
                                else {
                                    resolve(consoleUrl);
                                }
                            });
                        })];
                case 13:
                    url = _a.sent();
                    if (!options.url) return [3 /*break*/, 14];
                    console.log(url);
                    return [3 /*break*/, 22];
                case 14:
                    opts = !underscore_1.isEmpty(options.openWith) ? { app: options.openWith } : {};
                    console.error("Opening " + cli_color_1.default.underline(url) + " in the browser...");
                    _a.label = 15;
                case 15:
                    _a.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, Promise.race([
                            open_1.default(url, tslib_1.__assign(tslib_1.__assign({}, opts), { newInstance: true })),
                            new Promise(function (_, rej) {
                                setTimeout(function () { return rej(); }, 5000);
                            }), // timeout after 5 seconds
                        ])];
                case 16:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 17:
                    err_3 = _a.sent();
                    console.error("Failed to open " + url);
                    console.error('Please open the url in the browser of your choice');
                    return [3 /*break*/, 18];
                case 18:
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 21:
                    _a.sent(); // needed for if browser is still open
                    _a.label = 22;
                case 22: return [3 /*break*/, 24];
                case 23:
                    err_4 = _a.sent();
                    errorAndExit_1.errorAndExit(err_4.message, err_4);
                    return [3 /*break*/, 24];
                case 24: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksSessionsConsole = handleAlksSessionsConsole;
//# sourceMappingURL=alks-sessions-console.js.map