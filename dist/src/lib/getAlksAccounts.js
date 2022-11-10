"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlksAccounts = void 0;
var tslib_1 = require("tslib");
var getAlks_1 = require("./getAlks");
var getAuth_1 = require("./getAuth");
var log_1 = require("./log");
var memoizee_1 = tslib_1.__importDefault(require("memoizee"));
function _getAlksAccounts(options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var auth, alks, alksAccounts, filteredAlksAccounts;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, log_1.log)('refreshing alks accounts list');
                    return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 1:
                    auth = _a.sent();
                    return [4 /*yield*/, (0, getAlks_1.getAlks)(tslib_1.__assign({}, auth))];
                case 2:
                    alks = _a.sent();
                    return [4 /*yield*/, alks.getAccounts()];
                case 3:
                    alksAccounts = _a.sent();
                    (0, log_1.log)("All accounts: ".concat(alksAccounts.map(function (alksAccount) { return alksAccount.account; })));
                    filteredAlksAccounts = alksAccounts.filter(function (alksAccount) { return !options.iamOnly || alksAccount.iamKeyActive; });
                    return [2 /*return*/, filteredAlksAccounts];
            }
        });
    });
}
var memoized = (0, memoizee_1.default)(_getAlksAccounts, {
    maxAge: 5000,
});
function getAlksAccounts(options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            (0, log_1.log)('retreiving alks accounts');
            return [2 /*return*/, memoized(options)];
        });
    });
}
exports.getAlksAccounts = getAlksAccounts;
//# sourceMappingURL=getAlksAccounts.js.map