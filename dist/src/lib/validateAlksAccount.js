"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAlksAccount = void 0;
var tslib_1 = require("tslib");
var getAlksAccounts_1 = require("./getAlksAccounts");
var getAwsAccountFromString_1 = require("./getAwsAccountFromString");
function validateAlksAccount(account, role) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccounts, awsAccount, matchingAccount;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, getAlksAccounts_1.getAlksAccounts)()];
                case 1:
                    alksAccounts = _a.sent();
                    return [4 /*yield*/, (0, getAwsAccountFromString_1.getAwsAccountFromString)(account)];
                case 2:
                    awsAccount = _a.sent();
                    if (!awsAccount) {
                        throw new Error("account: \"".concat(account, "\" could not be resolved to a valid AWS account"));
                    }
                    matchingAccount = alksAccounts.find(function (alksAccount) {
                        return alksAccount.account.startsWith(awsAccount === null || awsAccount === void 0 ? void 0 : awsAccount.id) && alksAccount.role == role;
                    });
                    if (!matchingAccount) {
                        throw new Error("account: \"".concat(account, "\" and role: \"").concat(role, "\" do not match any valid accounts"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.validateAlksAccount = validateAlksAccount;
//# sourceMappingURL=validateAlksAccount.js.map