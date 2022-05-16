"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAlksAccount = void 0;
var tslib_1 = require("tslib");
var getAlksAccounts_1 = require("./getAlksAccounts");
function validateAlksAccount(account, role) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccounts, matchingAccount;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, getAlksAccounts_1.getAlksAccounts)()];
                case 1:
                    alksAccounts = _a.sent();
                    matchingAccount = alksAccounts.find(function (alksAccount) { return alksAccount.account == account && alksAccount.role == role; });
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