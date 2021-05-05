"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamDeleteRole = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAlksAccount_1 = require("../getAlksAccount");
var getAuth_1 = require("../getAuth");
var getDeveloper_1 = require("../getDeveloper");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksIamDeleteRole(options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var roleName, alksAccount, alksRole, filterFavorites, developer, auth, alks, err_1, err_2;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    roleName = options.rolename;
                    alksAccount = options.account;
                    alksRole = options.role;
                    filterFavorites = options.favorites || false;
                    log_1.log('validating role name: ' + roleName);
                    if (underscore_1.isEmpty(roleName)) {
                        errorAndExit_1.errorAndExit('The role name must be provided.');
                    }
                    if (!underscore_1.isUndefined(alksAccount) && underscore_1.isUndefined(alksRole)) {
                        log_1.log('trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 14, , 15]);
                    if (!(underscore_1.isEmpty(alksAccount) || underscore_1.isEmpty(alksRole))) return [3 /*break*/, 3];
                    log_1.log('getting accounts');
                    return [4 /*yield*/, getAlksAccount_1.getAlksAccount(program, {
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 2:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 4];
                case 3:
                    log_1.log('using provided account/role');
                    _b.label = 4;
                case 4: return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 5:
                    developer = _b.sent();
                    return [4 /*yield*/, getAuth_1.getAuth(program)];
                case 6:
                    auth = _b.sent();
                    log_1.log('calling api to delete role: ' + roleName);
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({ baseUrl: developer.server }, auth))];
                case 7:
                    alks = _b.sent();
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, alks.deleteRole({
                            account: alksAccount,
                            role: alksRole,
                            roleName: roleName,
                        })];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_1 = _b.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit(err_1)];
                case 11:
                    console.log(cli_color_1.default.white(['The role ', roleName, ' was deleted'].join('')));
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 15];
                case 14:
                    err_2 = _b.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamDeleteRole = handleAlksIamDeleteRole;
//# sourceMappingURL=alks-iam-deleterole.js.map