#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
var utils_1 = require("../lib/utils");
var developer_1 = require("../lib/developer");
var sessions_1 = require("../lib/sessions");
var iam_1 = require("../lib/iam");
var keys_1 = require("../lib/keys");
var outputValues = utils_1.getOutputValues();
commander_1.default
    .version(package_json_1.default.version)
    .description('creates or resumes a session')
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-p, --password [password]', 'my password')
    .option('-o, --output [format]', 'output format (' + outputValues.join(', ') + ')')
    .option('-n, --namedProfile [profile]', 'if output is set to creds, use this profile, default: default')
    .option('-f, --force', 'if output is set to creds, force overwriting of AWS credentials')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var alksAccount = commander_1.default.account;
var alksRole = commander_1.default.role;
var forceNewSession = commander_1.default.newSession;
var useDefaultAcct = commander_1.default.default;
var output = commander_1.default.output;
var filterFaves = commander_1.default.favorites || false;
var logger = 'sessions-open';
if (!underscore_1.default.isUndefined(alksAccount) && underscore_1.default.isUndefined(alksRole)) {
    utils_1.log(commander_1.default, logger, 'trying to extract role from account');
    alksRole = utils_1.tryToExtractRole(alksAccount);
}
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, err_1, key, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, utils_1.errorAndExit('Unable to load default account!', err_1)];
                case 3:
                    if (useDefaultAcct) {
                        alksAccount = developer.alksAccount;
                        alksRole = developer.alksRole;
                    }
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 9, , 10]);
                    if (!underscore_1.default.isUndefined(commander_1.default.iam)) return [3 /*break*/, 6];
                    return [4 /*yield*/, sessions_1.getSessionKey(commander_1.default, logger, alksAccount, alksRole, false, forceNewSession, filterFaves)];
                case 5:
                    key = _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, iam_1.getIAMKey(commander_1.default, logger, alksAccount, alksRole, forceNewSession, filterFaves)];
                case 7:
                    key = _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    return [2 /*return*/, utils_1.errorAndExit(err_2)];
                case 10:
                    console.log(keys_1.getKeyOutput(output || developer.outputFormat, key, commander_1.default.namedProfile, commander_1.default.force));
                    utils_1.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, developer_1.trackActivity(logger)];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils_1.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-sessions-open.js.map