"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamCreateRole = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
var getAuth_1 = require("../getAuth");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
var parseKeyValuePairs_1 = require("../parseKeyValuePairs");
function handleAlksIamCreateRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var roleNameDesc, ROLE_NAME_REGEX, roleName, roleType, incDefPolicies, enableAlksAccess, alksAccount, alksRole, filterFavorites, templateFields, _a, auth, alks, role, err_1, err_2;
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    roleNameDesc = 'alphanumeric including @+=._-';
                    ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
                    roleName = options.rolename;
                    roleType = options.roletype;
                    incDefPolicies = options.defaultPolicies;
                    enableAlksAccess = options.enableAlksAccess;
                    alksAccount = options.account;
                    alksRole = options.role;
                    filterFavorites = options.favorites || false;
                    if (!options.templateFields) return [3 /*break*/, 2];
                    return [4 /*yield*/, parseKeyValuePairs_1.parseKeyValuePairs(options.templateFields)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _c.label = 3;
                case 3:
                    templateFields = _a;
                    log_1.log('validating role name: ' + roleName);
                    if (underscore_1.isEmpty(roleName) || !ROLE_NAME_REGEX.test(roleName)) {
                        errorAndExit_1.errorAndExit('The role name provided contains illegal characters. It must be ' +
                            roleNameDesc);
                    }
                    log_1.log('validating role type: ' + roleType);
                    if (underscore_1.isEmpty(roleType)) {
                        errorAndExit_1.errorAndExit('The role type is required');
                    }
                    if (!underscore_1.isUndefined(alksAccount) && underscore_1.isUndefined(alksRole)) {
                        log_1.log('trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 16, , 17]);
                    if (!(underscore_1.isEmpty(alksAccount) || underscore_1.isEmpty(alksRole))) return [3 /*break*/, 6];
                    log_1.log('getting accounts');
                    return [4 /*yield*/, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole({
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 5:
                    (_b = _c.sent(), alksAccount = _b.alksAccount, alksRole = _b.alksRole);
                    return [3 /*break*/, 7];
                case 6:
                    log_1.log('using provided account/role');
                    _c.label = 7;
                case 7: return [4 /*yield*/, getAuth_1.getAuth()];
                case 8:
                    auth = _c.sent();
                    log_1.log('calling api to create role: ' + roleName);
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({}, auth))];
                case 9:
                    alks = _c.sent();
                    role = void 0;
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, alks.createRole({
                            account: alksAccount,
                            role: alksRole,
                            roleName: roleName,
                            roleType: roleType,
                            includeDefaultPolicy: incDefPolicies,
                            enableAlksAccess: enableAlksAccess,
                            templateFields: templateFields,
                        })];
                case 11:
                    role = _c.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_1 = _c.sent();
                    errorAndExit_1.errorAndExit(err_1);
                    return [3 /*break*/, 13];
                case 13:
                    console.log(cli_color_1.default.white(['The role: ', roleName, ' was created with the ARN: '].join('')) + cli_color_1.default.white.underline(role.roleArn));
                    if (role.instanceProfileArn) {
                        console.log(cli_color_1.default.white(['An instance profile was also created with the ARN: '].join('')) + cli_color_1.default.white.underline(role.instanceProfileArn));
                    }
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 15:
                    _c.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_2 = _c.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamCreateRole = handleAlksIamCreateRole;
//# sourceMappingURL=alks-iam-createrole.js.map