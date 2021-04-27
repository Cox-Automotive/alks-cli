#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var opn_1 = tslib_1.__importDefault(require("opn"));
var alks_node_1 = tslib_1.__importDefault(require("alks-node"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var utils = tslib_1.__importStar(require("../lib/utils"));
var Sessions = tslib_1.__importStar(require("../lib/sessions"));
var Developer = tslib_1.__importStar(require("../lib/developer"));
var Iam = tslib_1.__importStar(require("../lib/iam"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
commander_1.default
    .version(package_json_1.default.version)
    .description('open an AWS console in your browser')
    .option('-u, --url', 'just print the url')
    .option('-o, --openWith [appName]', 'open in a different app (optional)')
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-p, --password [password]', 'my password')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var alksAccount = commander_1.default.account;
var alksRole = commander_1.default.role;
var forceNewSession = commander_1.default.newSession;
var useDefaultAcct = commander_1.default.default;
var filterFaves = commander_1.default.favorites || false;
var logger = 'sessions-console';
if (!underscore_1.default.isUndefined(alksAccount) && underscore_1.default.isUndefined(alksRole)) {
    utils.log(commander_1.default, logger, 'trying to extract role from account');
    alksRole = utils.tryToExtractRole(alksAccount);
}
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dev, err_1, key, err_2, url, opts, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!useDefaultAcct) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Developer.getDeveloper()];
                case 2:
                    dev = _a.sent();
                    alksAccount = dev.alksAccount;
                    alksRole = dev.alksRole;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, utils.errorAndExit('Unable to load default account!', err_1)];
                case 4:
                    _a.trys.push([4, 9, , 10]);
                    if (!underscore_1.default.isUndefined(commander_1.default.iam)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Sessions.getSessionKey(commander_1.default, logger, alksAccount, alksRole, false, forceNewSession, filterFaves)];
                case 5:
                    key = _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, Iam.getIAMKey(commander_1.default, logger, alksAccount, alksRole, forceNewSession, filterFaves)];
                case 7:
                    key = _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    return [2 /*return*/, utils.errorAndExit(err_2)];
                case 10:
                    utils.log(commander_1.default, logger, 'calling aws to generate 15min console URL');
                    return [4 /*yield*/, new Promise(function (resolve) {
                            alks_node_1.default.generateConsoleUrl(key, { debug: commander_1.default.verbose, ua: utils.getUA() }, function (err, consoleUrl) {
                                if (err) {
                                    utils.errorAndExit(err.message, err);
                                }
                                else {
                                    resolve(consoleUrl);
                                }
                            });
                        })];
                case 11:
                    url = _a.sent();
                    if (!commander_1.default.url) return [3 /*break*/, 12];
                    console.log(url);
                    return [3 /*break*/, 20];
                case 12:
                    opts = !underscore_1.default.isEmpty(commander_1.default.openWith) ? { app: commander_1.default.openWith } : {};
                    _a.label = 13;
                case 13:
                    _a.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, opn_1.default(url, opts)];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 16];
                case 15:
                    err_3 = _a.sent();
                    console.error("Failed to open " + url);
                    console.error('Please open the url in the browser of your choice');
                    return [3 /*break*/, 16];
                case 16:
                    utils.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, Developer.trackActivity(logger)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 19:
                    _a.sent(); // needed for if browser is still open
                    process.exit(0);
                    _a.label = 20;
                case 20: return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-sessions-console.js.map