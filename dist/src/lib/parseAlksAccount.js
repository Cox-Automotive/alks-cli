"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAlksAccount = void 0;
const parseAlksAccount = (alksAccount) => {
    const [accountIdAndRole, accountAlias] = alksAccount.account.split(' - ');
    const [accountId, _accountRole] = accountIdAndRole.split('/');
    return Object.assign(Object.assign({}, alksAccount), { accountAlias, accountId, accountIdAndRole });
};
exports.parseAlksAccount = parseAlksAccount;
//# sourceMappingURL=parseAlksAccount.js.map