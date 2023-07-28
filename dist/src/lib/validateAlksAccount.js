"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAlksAccount = void 0;
const tslib_1 = require("tslib");
const getAlksAccounts_1 = require("./getAlksAccounts");
const getAwsAccountFromString_1 = require("./getAwsAccountFromString");
function validateAlksAccount(account, role) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const alksAccounts = yield (0, getAlksAccounts_1.getAlksAccounts)();
        const awsAccount = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(account);
        if (!awsAccount) {
            throw new Error(`account: "${account}" could not be resolved to a valid AWS account`);
        }
        const matchingAccount = alksAccounts.find((alksAccount) => alksAccount.account.startsWith(awsAccount === null || awsAccount === void 0 ? void 0 : awsAccount.id) && alksAccount.role == role);
        if (!matchingAccount) {
            throw new Error(`account: "${account}" and role: "${role}" do not match any valid accounts`);
        }
    });
}
exports.validateAlksAccount = validateAlksAccount;
//# sourceMappingURL=validateAlksAccount.js.map