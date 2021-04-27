#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var Alks = tslib_1.__importStar(require("../lib/alks"));
var Iam = tslib_1.__importStar(require("../lib/iam"));
var utils = tslib_1.__importStar(require("../lib/utils"));
var Developer = tslib_1.__importStar(require("../lib/developer"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
var logger = 'iam-deleteltk';
commander_1.default
    .version(package_json_1.default.version)
    .description('deletes an IAM Longterm Key')
    .option('-n, --iamusername [iamUsername]', 'the name of the iam user associated with the LTK')
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var iamUsername = commander_1.default.iamusername;
var alksAccount = commander_1.default.account;
var alksRole = commander_1.default.role;
var filterFaves = commander_1.default.favorites || false;
utils.log(commander_1.default, logger, 'validating iam user name: ' + iamUsername);
if (underscore_1.default.isEmpty(iamUsername)) {
    utils.errorAndExit('The IAM username is required.');
}
if (!underscore_1.default.isUndefined(alksAccount) && underscore_1.default.isUndefined(alksRole)) {
    utils.log(commander_1.default, logger, 'trying to extract role from account');
    alksRole = utils.tryToExtractRole(alksAccount);
}
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var iamAccount, err_1, developer, auth, alks, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Iam.getIAMAccount(commander_1.default, logger, alksAccount, alksRole, filterFaves)];
                case 1:
                    iamAccount = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, utils.errorAndExit(err_1)];
                case 3:
                    developer = iamAccount.developer, auth = iamAccount.auth;
                    (alksAccount = iamAccount.account, alksRole = iamAccount.role);
                    return [4 /*yield*/, Alks.getAlks({
                            baseUrl: developer.server,
                            userid: developer.userid,
                            password: auth.password,
                            token: auth.token,
                        })];
                case 4:
                    alks = _a.sent();
                    utils.log(commander_1.default, logger, 'calling api to delete ltk: ' + iamUsername);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, alks.deleteIAMUser({
                            account: alksAccount,
                            role: alksRole,
                            iamUserName: iamUsername,
                        })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    return [2 /*return*/, utils.errorAndExit(err_2)];
                case 8:
                    console.log(cli_color_1.default.white(['LTK deleted for IAM User: ', iamUsername].join('')));
                    utils.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, Developer.trackActivity(logger)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-iam-deleteltk.js.map