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
var tryToExtractRole_1 = require("../tryToExtractRole");
var parseKeyValuePairs_1 = require("../parseKeyValuePairs");
function handleAlksIamCreateRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var roleNameDesc, ROLE_NAME_REGEX, roleName, roleType, incDefPolicies, enableAlksAccess, alksAccount, alksRole, filterFavorites, templateFields, auth, alks, role, err_1, err_2;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
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
                    templateFields = options.templateFields
                        ? parseKeyValuePairs_1.parseKeyValuePairs(options.templateFields)
                        : undefined;
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
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    if (!(underscore_1.isEmpty(alksAccount) || underscore_1.isEmpty(alksRole))) return [3 /*break*/, 3];
                    log_1.log('getting accounts');
                    return [4 /*yield*/, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole({
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 2:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 4];
                case 3:
                    log_1.log('using provided account/role');
                    _b.label = 4;
                case 4: return [4 /*yield*/, getAuth_1.getAuth()];
                case 5:
                    auth = _b.sent();
                    log_1.log('calling api to create role: ' + roleName);
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({}, auth))];
                case 6:
                    alks = _b.sent();
                    role = void 0;
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, alks.createRole({
                            account: alksAccount,
                            role: alksRole,
                            roleName: roleName,
                            roleType: roleType,
                            includeDefaultPolicy: incDefPolicies ? 1 : 0,
                            enableAlksAccess: enableAlksAccess,
                            templateFields: templateFields,
                        })];
                case 8:
                    role = _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _b.sent();
                    errorAndExit_1.errorAndExit(err_1);
                    return [3 /*break*/, 10];
                case 10:
                    console.log(cli_color_1.default.white(['The role: ', roleName, ' was created with the ARN: '].join('')) + cli_color_1.default.white.underline(role.roleArn));
                    if (role.instanceProfileArn) {
                        console.log(cli_color_1.default.white(['An instance profile was also created with the ARN: '].join('')) + cli_color_1.default.white.underline(role.instanceProfileArn));
                    }
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_2 = _b.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamCreateRole = handleAlksIamCreateRole;
//# sourceMappingURL=alks-iam-createrole.js.map