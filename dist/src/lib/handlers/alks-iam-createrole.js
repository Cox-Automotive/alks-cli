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
var unpackTags_1 = require("../unpackTags");
var getAwsAccountFromString_1 = require("../getAwsAccountFromString");
var badAccountMessage_1 = require("../badAccountMessage");
function handleAlksIamCreateRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var roleNameDesc, ROLE_NAME_REGEX, roleName, roleType, trustPolicy, incDefPolicies, enableAlksAccess, alksAccount, alksRole, filterFavorites, tags, templateFields, roleTypeExists, trustPolicyExists, auth, awsAccount, alks, role, err_1, err_2;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    roleNameDesc = 'alphanumeric including @+=._-';
                    ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
                    roleName = options.rolename;
                    roleType = options.roletype ? options.roletype : undefined;
                    try {
                        trustPolicy = options.trustPolicy
                            ? JSON.parse(options.trustPolicy)
                            : undefined;
                    }
                    catch (_c) {
                        (0, errorAndExit_1.errorAndExit)('Error parsing trust policy.  Must be valid JSON string');
                    }
                    incDefPolicies = options.defaultPolicies;
                    enableAlksAccess = options.enableAlksAccess;
                    alksAccount = options.account;
                    alksRole = options.role;
                    filterFavorites = options.favorites || false;
                    tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
                    templateFields = options.templateFields
                        ? (0, parseKeyValuePairs_1.parseKeyValuePairs)(options.templateFields)
                        : undefined;
                    (0, log_1.log)('validating role name: ' + roleName);
                    if (!roleName || !ROLE_NAME_REGEX.test(roleName)) {
                        (0, errorAndExit_1.errorAndExit)('The role name provided contains illegal characters. It must be ' +
                            roleNameDesc);
                    }
                    (0, log_1.log)('validating role type or trust policy');
                    roleTypeExists = (0, underscore_1.isEmpty)(roleType);
                    trustPolicyExists = (0, underscore_1.isEmpty)(trustPolicy);
                    if (roleTypeExists === trustPolicyExists) {
                        (0, errorAndExit_1.errorAndExit)('Must provide role type or trust policy but not both.');
                    }
                    if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
                        (0, log_1.log)('trying to extract role from account');
                        alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 13, , 14]);
                    if (!(!alksAccount || !alksRole)) return [3 /*break*/, 3];
                    (0, log_1.log)('getting accounts');
                    return [4 /*yield*/, (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 2:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 4];
                case 3:
                    (0, log_1.log)('using provided account/role');
                    _b.label = 4;
                case 4: return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 5:
                    auth = _b.sent();
                    return [4 /*yield*/, (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount)];
                case 6:
                    awsAccount = _b.sent();
                    if (!awsAccount) {
                        throw new Error(badAccountMessage_1.badAccountMessage);
                    }
                    (0, log_1.log)('calling api to create role: ' + roleName);
                    return [4 /*yield*/, (0, getAlks_1.getAlks)(tslib_1.__assign({}, auth))];
                case 7:
                    alks = _b.sent();
                    role = void 0;
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, alks.createRole({
                            account: awsAccount.id,
                            role: alksRole,
                            roleName: roleName,
                            roleType: roleType,
                            trustPolicy: trustPolicy,
                            includeDefaultPolicy: incDefPolicies ? 1 : 0,
                            enableAlksAccess: enableAlksAccess,
                            tags: tags,
                            templateFields: templateFields,
                        })];
                case 9:
                    role = _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_1 = _b.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1);
                    return [3 /*break*/, 11];
                case 11:
                    console.log(cli_color_1.default.white(['The role: ', roleName, ' was created with the ARN: '].join('')) + cli_color_1.default.white.underline(role.roleArn));
                    if (role.instanceProfileArn) {
                        console.log(cli_color_1.default.white(['An instance profile was also created with the ARN: '].join('')) + cli_color_1.default.white.underline(role.instanceProfileArn));
                    }
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 13:
                    err_2 = _b.sent();
                    (0, errorAndExit_1.errorAndExit)(err_2.message, err_2);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamCreateRole = handleAlksIamCreateRole;
//# sourceMappingURL=alks-iam-createrole.js.map