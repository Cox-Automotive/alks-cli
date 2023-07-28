"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAwsAccountFromString = void 0;
const tslib_1 = require("tslib");
const getAlksAccounts_1 = require("./getAlksAccounts");
const accountIdRegex = /^[0-9]{12}/;
// This alias regex was sourced from AWS's docs here -> https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateAccountAlias.html
const aliasRegex = /^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$/;
/**
 * Gets an ALKS Account object from a user-provided account string. The user must have access to the account for it to be resolved
 *
 * @param accountString - a string uniquely identifying an AWS account that can take many forms, such as "012345678910/ALKSAdmin - awstest123", "012345678910/ALKSAdmin", "awstest123", or "012345678910"
 */
function getAwsAccountFromString(accountString) {
    var _a, _b, _c;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const accounts = yield (0, getAlksAccounts_1.getAlksAccounts)();
        const accountId = ((_a = accountString.match(accountIdRegex)) !== null && _a !== void 0 ? _a : [undefined])[0];
        const alias = ((_b = accountString.match(aliasRegex)) !== null && _b !== void 0 ? _b : [undefined])[0];
        let alksAccount;
        if (accountId) {
            // Get a list of account/role pairs whose account string (e.g. "012345678910/ALKSAdmin - awstest123") starts with an account ID that matches the provided account ID
            const matchingAccounts = accounts.filter((account) => accountId === account.account.substring(0, 12));
            if (matchingAccounts.length > 0) {
                alksAccount = matchingAccounts[0];
            }
        }
        else if (alias) {
            // Get a list of account/role pairs whose account string (e.g. "012345678910/ALKSAdmin - awstest123") contains an alias that matches the provided alias
            const matchingAccounts = accounts.filter((account) => { var _a; return ((_a = account.account.match(new RegExp(` - ${alias}$`))) === null || _a === void 0 ? void 0 : _a.length) === 1; });
            if (matchingAccounts.length > 0) {
                alksAccount = matchingAccounts[0];
            }
        }
        if (alksAccount) {
            return {
                id: alksAccount.account.substring(0, 12),
                alias: alksAccount.account.split(' - ')[1],
                label: (_c = alksAccount.skypieaAccount) === null || _c === void 0 ? void 0 : _c.label,
            };
        }
        // if no matches were found
        return undefined;
    });
}
exports.getAwsAccountFromString = getAwsAccountFromString;
//# sourceMappingURL=getAwsAccountFromString.js.map