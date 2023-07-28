"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlksAccounts = void 0;
const tslib_1 = require("tslib");
const getAlks_1 = require("./getAlks");
const getAuth_1 = require("./getAuth");
const log_1 = require("./log");
const memoizee_1 = tslib_1.__importDefault(require("memoizee"));
function _getAlksAccounts(options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('refreshing alks accounts list');
        const auth = yield (0, getAuth_1.getAuth)();
        // load available account/roles
        const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
        const alksAccounts = yield alks.getAccounts();
        (0, log_1.log)(`All accounts: ${alksAccounts.map((alksAccount) => alksAccount.account)}`);
        // Filter out non-iam-active accounts if iamOnly flag is passed
        const filteredAlksAccounts = alksAccounts.filter((alksAccount) => !options.iamOnly || alksAccount.iamKeyActive);
        return filteredAlksAccounts;
    });
}
const memoized = (0, memoizee_1.default)(_getAlksAccounts, {
    maxAge: 5000,
});
function getAlksAccounts(options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('retreiving alks accounts');
        return memoized(options);
    });
}
exports.getAlksAccounts = getAlksAccounts;
//# sourceMappingURL=getAlksAccounts.js.map