"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAccountId = void 0;
function extractAccountId(account) {
    let match;
    const accountIdRegex = /^\d{12}$/g; // If the account is just a 12 digit number
    const accountIdPlusRoleRegex = /(^\d{12})(\/)/g; // If the account is 12 digit number followed by slash
    if (accountIdRegex.exec(account)) {
        return account;
    }
    else {
        match = accountIdPlusRoleRegex.exec(account);
        if (match) {
            return match[1]; // Return the first match group, which is the 12 digit ID
        }
    }
    return undefined;
}
exports.extractAccountId = extractAccountId;
//# sourceMappingURL=extractAccountId.js.map