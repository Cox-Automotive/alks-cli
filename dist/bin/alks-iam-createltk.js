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
var logger = 'iam-createltk';
var nameDesc = 'alphanumeric including @+=._-';
commander_1.default
    .version(package_json_1.default.version)
    .description('creates a new IAM Longterm Key')
    .option('-n, --iamusername [iamUsername]', 'the name of the iam user associated with the LTK, ' + nameDesc)
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-o, --output [format]', 'output format (text, json)', 'text')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
var iamUsername = commander_1.default.iamusername;
var alksAccount = commander_1.default.account;
var alksRole = commander_1.default.role;
var filterFaves = commander_1.default.favorites || false;
var output = commander_1.default.output || 'text';
utils.log(commander_1.default, logger, 'validating iam user name: ' + iamUsername);
if (underscore_1.default.isEmpty(iamUsername)) {
    utils.errorAndExit('Please provide a username (-n)');
}
else if (!NAME_REGEX.test(iamUsername)) {
    utils.errorAndExit('The username provided contains illegal characters. It must be ' + nameDesc);
}
if (!underscore_1.default.isUndefined(alksAccount) && underscore_1.default.isUndefined(alksRole)) {
    utils.log(commander_1.default, logger, 'trying to extract role from account');
    alksRole = utils.tryToExtractRole(alksAccount);
}
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var iamAccount, err_1, developer, auth, alks, ltk, ltkData, ltkData;
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
                    return [4 /*yield*/, Alks.getAlks(tslib_1.__assign({ baseUrl: developer.server }, auth))];
                case 4:
                    alks = _a.sent();
                    utils.log(commander_1.default, logger, 'calling api to create ltk: ' + iamUsername);
                    if (!alksAccount || !alksRole) {
                        throw new Error('Must specifify ALKS Account and Role');
                    }
                    return [4 /*yield*/, alks.createAccessKeys({
                            account: alksAccount,
                            role: alksRole,
                            iamUserName: iamUsername,
                        })];
                case 5:
                    ltk = _a.sent();
                    if (output === 'json') {
                        ltkData = {
                            accessKey: ltk.accessKey,
                            secretKey: ltk.secretKey,
                            iamUserName: iamUsername,
                            iamUserArn: ltk.iamUserArn,
                        };
                        console.log(JSON.stringify(ltkData, null, 4));
                    }
                    else {
                        ltkData = {
                            accessKey: ltk.accessKey,
                            secretKey: ltk.secretKey,
                            iamUserName: iamUsername,
                            iamUserArn: ltk.iamUserArn,
                            alksAccount: alksAccount,
                            alksRole: alksRole,
                        };
                        console.log(cli_color_1.default.white([
                            'LTK created for IAM User: ',
                            iamUsername,
                            ' was created with the ARN: ',
                        ].join('')) + cli_color_1.default.white.underline(ltkData.iamUserArn));
                        console.log(cli_color_1.default.white(['LTK Access Key: '].join('')) +
                            cli_color_1.default.white.underline(ltkData.accessKey));
                        console.log(cli_color_1.default.white(['LTK Secret Key: '].join('')) +
                            cli_color_1.default.white.underline(ltkData.secretKey));
                    }
                    utils.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, Developer.trackActivity(logger)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-iam-createltk.js.map