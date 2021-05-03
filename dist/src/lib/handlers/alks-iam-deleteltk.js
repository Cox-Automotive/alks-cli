"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamDeleteLtk = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getIamAccount_1 = require("../getIamAccount");
var log_1 = require("../log");
var tractActivity_1 = require("../tractActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksIamDeleteLtk(options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var logger, iamUsername, alksAccount, alksRole, filterFaves, iamAccount, err_1, developer, auth, alks, err_2, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = 'iam-deleteltk';
                    iamUsername = options.iamusername;
                    alksAccount = options.account;
                    alksRole = options.role;
                    filterFaves = options.favorites || false;
                    log_1.log(program, logger, 'validating iam user name: ' + iamUsername);
                    if (underscore_1.isEmpty(iamUsername)) {
                        errorAndExit_1.errorAndExit('The IAM username is required.');
                    }
                    if (!underscore_1.isUndefined(alksAccount) && underscore_1.isUndefined(alksRole)) {
                        log_1.log(program, logger, 'trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 13, , 14]);
                    iamAccount = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getIamAccount_1.getIAMAccount(program, logger, alksAccount, alksRole, filterFaves)];
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
                    log_1.log(program, logger, 'calling api to delete ltk: ' + iamUsername);
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, alks.deleteIAMUser({
                            account: alksAccount,
                            role: alksRole,
                            iamUserName: iamUsername,
                        })];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit(err_2)];
                case 10:
                    console.log(cli_color_1.default.white(['LTK deleted for IAM User: ', iamUsername].join('')));
                    log_1.log(program, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, tractActivity_1.trackActivity(logger)];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 13:
                    err_3 = _a.sent();
                    errorAndExit_1.errorAndExit(err_3.message, err_3);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamDeleteLtk = handleAlksIamDeleteLtk;
//# sourceMappingURL=alks-iam-deleteltk.js.map