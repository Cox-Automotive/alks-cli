"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamDeleteLtk = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var log_1 = require("../log");
var promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
var tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksIamDeleteLtk(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var iamUsername, alksAccount, alksRole, filterFaves, auth, alks, err_1, err_2;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    iamUsername = options.iamusername;
                    alksAccount = options.account;
                    alksRole = options.role;
                    filterFaves = options.favorites || false;
                    log_1.log('validating iam user name: ' + iamUsername);
                    if (underscore_1.isEmpty(iamUsername)) {
                        errorAndExit_1.errorAndExit('The IAM username is required.');
                    }
                    if (!underscore_1.isUndefined(alksAccount) && underscore_1.isUndefined(alksRole)) {
                        log_1.log('trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 11, , 12]);
                    if (!(underscore_1.isEmpty(alksAccount) || underscore_1.isEmpty(alksRole))) return [3 /*break*/, 3];
                    return [4 /*yield*/, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole({
                            iamOnly: true,
                            filterFavorites: filterFaves,
                        })];
                case 2:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    _b.label = 3;
                case 3: return [4 /*yield*/, getAuth_1.getAuth()];
                case 4:
                    auth = _b.sent();
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({}, auth))];
                case 5:
                    alks = _b.sent();
                    log_1.log('calling api to delete ltk: ' + iamUsername);
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, alks.deleteIAMUser({
                            account: alksAccount,
                            role: alksRole,
                            iamUserName: iamUsername,
                        })];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _b.sent();
                    errorAndExit_1.errorAndExit(err_1);
                    return [3 /*break*/, 9];
                case 9:
                    console.log(cli_color_1.default.white(['LTK deleted for IAM User: ', iamUsername].join('')));
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 11:
                    err_2 = _b.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamDeleteLtk = handleAlksIamDeleteLtk;
//# sourceMappingURL=alks-iam-deleteltk.js.map