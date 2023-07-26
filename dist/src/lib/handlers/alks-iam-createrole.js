"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamCreateRole = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const underscore_1 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
const getAuth_1 = require("../getAuth");
const log_1 = require("../log");
const tryToExtractRole_1 = require("../tryToExtractRole");
const parseKeyValuePairs_1 = require("../parseKeyValuePairs");
const unpackTags_1 = require("../unpackTags");
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
const badAccountMessage_1 = require("../badAccountMessage");
function handleAlksIamCreateRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const roleNameDesc = 'alphanumeric including @+=._-';
        const ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
        const roleName = options.rolename;
        const roleType = options.roletype ? options.roletype : undefined;
        let trustPolicy;
        try {
            trustPolicy = options.trustPolicy
                ? JSON.parse(options.trustPolicy)
                : undefined;
        }
        catch (_a) {
            (0, errorAndExit_1.errorAndExit)('Error parsing trust policy.  Must be valid JSON string');
        }
        const incDefPolicies = options.defaultPolicies;
        const enableAlksAccess = options.enableAlksAccess;
        let alksAccount = options.account;
        let alksRole = options.role;
        const filterFavorites = options.favorites || false;
        const tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
        const templateFields = options.templateFields
            ? (0, parseKeyValuePairs_1.parseKeyValuePairs)(options.templateFields)
            : undefined;
        (0, log_1.log)('validating role name: ' + roleName);
        if (!roleName || !ROLE_NAME_REGEX.test(roleName)) {
            (0, errorAndExit_1.errorAndExit)('The role name provided contains illegal characters. It must be ' +
                roleNameDesc);
        }
        (0, log_1.log)('validating role type or trust policy');
        const roleTypeExists = (0, underscore_1.isEmpty)(roleType);
        const trustPolicyExists = (0, underscore_1.isEmpty)(trustPolicy);
        if (roleTypeExists === trustPolicyExists) {
            (0, errorAndExit_1.errorAndExit)('Must provide role type or trust policy but not both.');
        }
        if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
            (0, log_1.log)('trying to extract role from account');
            alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
        }
        try {
            if (!alksAccount || !alksRole) {
                (0, log_1.log)('getting accounts');
                ({ alksAccount, alksRole } = yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                    iamOnly: true,
                    filterFavorites,
                }));
            }
            else {
                (0, log_1.log)('using provided account/role');
            }
            const auth = yield (0, getAuth_1.getAuth)();
            const awsAccount = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount);
            if (!awsAccount) {
                throw new Error(badAccountMessage_1.badAccountMessage);
            }
            (0, log_1.log)('calling api to create role: ' + roleName);
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            let role;
            try {
                role = yield alks.createRole({
                    account: awsAccount.id,
                    role: alksRole,
                    roleName,
                    roleType,
                    trustPolicy,
                    includeDefaultPolicy: incDefPolicies ? 1 : 0,
                    enableAlksAccess,
                    tags,
                    templateFields,
                });
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            console.log(cli_color_1.default.white(`The role "${roleName}" was created with the ARN: `) +
                cli_color_1.default.white.underline(role.roleArn));
            if (role.instanceProfileArn) {
                console.log(cli_color_1.default.white('An instance profile was also created with the ARN: ') +
                    cli_color_1.default.white.underline(role.instanceProfileArn));
            }
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksIamCreateRole = handleAlksIamCreateRole;
//# sourceMappingURL=alks-iam-createrole.js.map