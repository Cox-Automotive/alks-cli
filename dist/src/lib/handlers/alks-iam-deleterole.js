"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamDeleteRole = void 0;
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
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
const badAccountMessage_1 = require("../badAccountMessage");
function handleAlksIamDeleteRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const roleName = options.rolename;
        let alksAccount = options.account;
        let alksRole = options.role;
        const filterFavorites = options.favorites || false;
        (0, log_1.log)('validating role name: ' + roleName);
        if ((0, underscore_1.isEmpty)(roleName)) {
            (0, errorAndExit_1.errorAndExit)('The role name must be provided.');
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
            (0, log_1.log)('calling api to delete role: ' + roleName);
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            try {
                yield alks.deleteRole({
                    account: awsAccount.id,
                    role: alksRole,
                    roleName,
                });
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            console.log(cli_color_1.default.white(`The role "${roleName}" was deleted`));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksIamDeleteRole = handleAlksIamDeleteRole;
//# sourceMappingURL=alks-iam-deleterole.js.map