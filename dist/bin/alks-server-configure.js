#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var utils = tslib_1.__importStar(require("../lib/utils"));
var Developer = tslib_1.__importStar(require("../lib/developer"));
var Sessions = tslib_1.__importStar(require("../lib/sessions"));
var Iam = tslib_1.__importStar(require("../lib/iam"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
commander_1.default
    .version(package_json_1.default.version)
    .description('configures the alks metadata server')
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-p, --password [password]', 'my password')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var alksAccount = commander_1.default.account;
var alksRole = commander_1.default.role;
var forceNewSession = commander_1.default.newSession;
var filterFaves = commander_1.default.favorites || false;
var logger = 'server-configure';
if (!underscore_1.default.isUndefined(alksAccount) && underscore_1.default.isUndefined(alksRole)) {
    utils.log(commander_1.default, logger, 'trying to extract role from account');
    alksRole = utils.tryToExtractRole(alksAccount);
}
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var key, err_1, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!underscore_1.default.isUndefined(commander_1.default.iam)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Sessions.getSessionKey(commander_1.default, logger, alksAccount, alksRole, false, forceNewSession, filterFaves)];
                case 1:
                    key = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, Iam.getIAMKey(commander_1.default, logger, alksAccount, alksRole, forceNewSession, filterFaves)];
                case 3:
                    key = _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    return [2 /*return*/, utils.errorAndExit(err_1)];
                case 6: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, Developer.saveMetadata({
                            alksAccount: key.alksAccount,
                            alksRole: key.alksRole,
                            isIam: key.isIAM,
                        })];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _a.sent();
                    return [2 /*return*/, utils.errorAndExit('Unable to save metadata!', err_2)];
                case 11:
                    console.error(cli_color_1.default.white('Metadata has been saved!'));
                    utils.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, Developer.trackActivity(logger)];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-server-configure.js.map