"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsConsole = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getDeveloper_1 = require("../getDeveloper");
var getIamKey_1 = require("../getIamKey");
var getSessionKey_1 = require("../getSessionKey");
var getUserAgentString_1 = require("../getUserAgentString");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
var alks_node_1 = tslib_1.__importDefault(require("alks-node"));
var open_1 = tslib_1.__importDefault(require("open"));
function handleAlksSessionsConsole(options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccount, alksRole, forceNewSession, useDefaultAcct, filterFaves, dev, err_1, key_1, err_2, url, opts, err_3, err_4;
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
                    _a.trys.push([1, 22, , 23]);
                    if (!useDefaultAcct) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 3:
                    dev = _a.sent();
                    alksAccount = dev.alksAccount;
                    alksRole = dev.alksRole;
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    errorAndExit_1.errorAndExit('Unable to load default account!', err_1);
                    return [3 /*break*/, 5];
                case 5:
                    _a.trys.push([5, 10, , 11]);
                    if (!underscore_1.isUndefined(options.iam)) return [3 /*break*/, 7];
                    return [4 /*yield*/, getSessionKey_1.getSessionKey(program, alksAccount, alksRole, false, forceNewSession, filterFaves)];
                case 6:
                    key_1 = _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, getIamKey_1.getIamKey(program, alksAccount, alksRole, forceNewSession, filterFaves)];
                case 8:
                    key_1 = _a.sent();
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_2 = _a.sent();
                    errorAndExit_1.errorAndExit(err_2);
                    return [3 /*break*/, 11];
                case 11:
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
                case 12:
                    url = _a.sent();
                    if (!options.url) return [3 /*break*/, 13];
                    console.log(url);
                    return [3 /*break*/, 21];
                case 13:
                    opts = !underscore_1.isEmpty(options.openWith) ? { app: options.openWith } : {};
                    _a.label = 14;
                case 14:
                    _a.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, Promise.race([
                            open_1.default(url, tslib_1.__assign(tslib_1.__assign({}, opts), { newInstance: true })),
                            new Promise(function (_, rej) { setTimeout(function () { return rej(); }, 5000); }) // timeout after 5 seconds
                        ])];
                case 15:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_3 = _a.sent();
                    console.error("Failed to open " + url);
                    console.error('Please open the url in the browser of your choice');
                    return [3 /*break*/, 17];
                case 17:
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 20:
                    _a.sent(); // needed for if browser is still open
                    process.exit(0);
                    _a.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    err_4 = _a.sent();
                    errorAndExit_1.errorAndExit(err_4.message, err_4);
                    return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksSessionsConsole = handleAlksSessionsConsole;
//# sourceMappingURL=alks-sessions-console.js.map