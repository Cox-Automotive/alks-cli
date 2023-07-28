"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamCreateTrustRole = void 0;
const tslib_1 = require("tslib");
const alks_js_1 = tslib_1.__importDefault(require("alks.js"));
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const underscore_1 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
const getAuth_1 = require("../getAuth");
const log_1 = require("../log");
const tryToExtractRole_1 = require("../tryToExtractRole");
const unpackTags_1 = require("../unpackTags");
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
const badAccountMessage_1 = require("../badAccountMessage");
function handleAlksIamCreateTrustRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const roleNameDesc = 'alphanumeric including @+=._-';
        const trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';
        const ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
        const TRUST_ARN_REGEX = /arn:(aws|aws-us-gov):iam::\d{12}:role\/?[a-zA-Z_0-9+=,.@-_/]+/g;
        const roleName = options.rolename;
        const roleType = options.roletype;
        const trustArn = options.trustarn;
        const enableAlksAccess = options.enableAlksAccess;
        let alksAccount = options.account;
        let alksRole = options.role;
        const tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
        const filterFavorites = options.favorites || false;
        (0, log_1.log)('validating role name: ' + roleName);
        if ((0, underscore_1.isEmpty)(roleName) || !ROLE_NAME_REGEX.test(roleName)) {
            (0, errorAndExit_1.errorAndExit)('The role name provided contains illegal characters. It must be ' +
                roleNameDesc);
        }
        (0, log_1.log)('validating role type: ' + roleType);
        if ((0, underscore_1.isEmpty)(roleType) ||
            (roleType !== 'Cross Account' && roleType !== 'Inner Account')) {
            (0, errorAndExit_1.errorAndExit)('The role type is required');
        }
        (0, log_1.log)('validating trust arn: ' + trustArn);
        if ((0, underscore_1.isEmpty)(trustArn) || !TRUST_ARN_REGEX.test(trustArn)) {
            (0, errorAndExit_1.errorAndExit)('The trust arn provided contains illegal characters. It must be ' +
                trustArnDesc);
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
            (0, log_1.log)('calling api to create trust role: ' + roleName);
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            let role;
            try {
                role = yield alks.createNonServiceRole({
                    account: awsAccount.id,
                    role: alksRole,
                    roleName,
                    roleType,
                    trustArn,
                    enableAlksAccess,
                    includeDefaultPolicy: alks_js_1.default.PseudoBoolean.False,
                    tags,
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
exports.handleAlksIamCreateTrustRole = handleAlksIamCreateTrustRole;
//# sourceMappingURL=alks-iam-createtrustrole.js.map