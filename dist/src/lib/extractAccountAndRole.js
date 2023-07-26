"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAccountAndRole = void 0;
const tslib_1 = require("tslib");
const underscore_1 = require("underscore");
const log_1 = require("./log");
const tryToExtractRole_1 = require("./tryToExtractRole");
const promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
const getAwsAccountFromString_1 = require("./getAwsAccountFromString");
const badAccountMessage_1 = require("./badAccountMessage");
/**
 * Gets an AwsAccount object and a role name from the provided options. If options are missing, it asks the user to select them
 *
 * @param options - the commander options object
 * @returns an account and role pair
 */
function extractAccountAndRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let alksAccount = options.account;
        let alksRole = options.role;
        const filterFavorites = options.favorites || false;
        if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
            (0, log_1.log)('trying to extract role from account');
            alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
        }
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
        const awsAccount = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount);
        if (!awsAccount) {
            throw new Error(badAccountMessage_1.badAccountMessage);
        }
        return {
            awsAccount,
            role: alksRole,
        };
    });
}
exports.extractAccountAndRole = extractAccountAndRole;
//# sourceMappingURL=extractAccountAndRole.js.map