"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamCreateLtk = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getIamAccount_1 = require("../getIamAccount");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksIamCreateLtk(options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var nameDesc, NAME_REGEX, iamUsername, alksAccount, alksRole, filterFaves, output, iamAccount, err_1, developer, auth, alks, ltk, ltkData, ltkData, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nameDesc = 'alphanumeric including @+=._-';
                    NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
                    iamUsername = options.iamusername;
                    alksAccount = options.account;
                    alksRole = options.role;
                    filterFaves = options.favorites || false;
                    output = options.output || 'text';
                    log_1.log('validating iam user name: ' + iamUsername);
                    if (underscore_1.isEmpty(iamUsername)) {
                        errorAndExit_1.errorAndExit('Please provide a username (-n)');
                    }
                    else if (!NAME_REGEX.test(iamUsername)) {
                        errorAndExit_1.errorAndExit('The username provided contains illegal characters. It must be ' +
                            nameDesc);
                    }
                    if (!underscore_1.isUndefined(alksAccount) && underscore_1.isUndefined(alksRole)) {
                        log_1.log('trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    iamAccount = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getIamAccount_1.getIAMAccount(program, alksAccount, alksRole, filterFaves)];
                case 3:
                    iamAccount = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit(err_1)];
                case 5:
                    developer = iamAccount.developer, auth = iamAccount.auth;
                    (alksAccount = iamAccount.account, alksRole = iamAccount.role);
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({ baseUrl: developer.server }, auth))];
                case 6:
                    alks = _a.sent();
                    log_1.log('calling api to create ltk: ' + iamUsername);
                    if (!alksAccount || !alksRole) {
                        throw new Error('Must specifify ALKS Account and Role');
                    }
                    return [4 /*yield*/, alks.createAccessKeys({
                            account: alksAccount,
                            role: alksRole,
                            iamUserName: iamUsername,
                        })];
                case 7:
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
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _a.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamCreateLtk = handleAlksIamCreateLtk;
//# sourceMappingURL=alks-iam-createltk.js.map