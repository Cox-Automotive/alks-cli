"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamDeleteLtk = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const underscore_1 = require("underscore");
const badAccountMessage_1 = require("../badAccountMessage");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
const log_1 = require("../log");
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
const tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksIamDeleteLtk(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const iamUsername = options.iamusername;
        let alksAccount = options.account;
        let alksRole = options.role;
        const filterFaves = options.favorites || false;
        (0, log_1.log)('validating iam user name: ' + iamUsername);
        if ((0, underscore_1.isEmpty)(iamUsername)) {
            (0, errorAndExit_1.errorAndExit)('The IAM username is required.');
        }
        if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
            (0, log_1.log)('trying to extract role from account');
            alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
        }
        try {
            if (!alksAccount || !alksRole) {
                ({ alksAccount, alksRole } = yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                    iamOnly: true,
                    filterFavorites: filterFaves,
                }));
            }
            const auth = yield (0, getAuth_1.getAuth)();
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            const awsAccount = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount);
            if (!awsAccount) {
                throw new Error(badAccountMessage_1.badAccountMessage);
            }
            (0, log_1.log)('calling api to delete ltk: ' + iamUsername);
            try {
                yield alks.deleteIAMUser({
                    account: awsAccount.id,
                    role: alksRole,
                    iamUserName: iamUsername,
                });
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            console.log(cli_color_1.default.white(`LTK deleted for IAM User: ${iamUsername}`));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksIamDeleteLtk = handleAlksIamDeleteLtk;
//# sourceMappingURL=alks-iam-deleteltk.js.map