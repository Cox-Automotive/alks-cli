"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAccountOutput = void 0;
const getAccountDelim_1 = require("./getAccountDelim");
// Output example: AccountName ..... AccountId/AccountRole    :: Role
const formatAccountOutput = (alksAccount, maxAccountAliasLength, maxAccountIdAndRoleLength) => {
    return [
        `${alksAccount.accountAlias} .`.padEnd(maxAccountAliasLength + 2, '.'),
        alksAccount.accountIdAndRole.padEnd(maxAccountIdAndRoleLength, ' '),
        (0, getAccountDelim_1.getAccountDelim)(),
        alksAccount.role,
    ].join(' ');
};
exports.formatAccountOutput = formatAccountOutput;
//# sourceMappingURL=formatAccountOutput.js.map