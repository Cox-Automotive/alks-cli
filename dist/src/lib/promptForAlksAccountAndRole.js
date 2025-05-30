"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForAlksAccountAndRole = void 0;
const tslib_1 = require("tslib");
const getAccountDelim_1 = require("./getAccountDelim");
const getAlksAccounts_1 = require("./getAlksAccounts");
const getFavorites_1 = require("./getFavorites");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
const log_1 = require("./log");
const alksAccount_1 = require("./state/alksAccount");
const alksRole_1 = require("./state/alksRole");
const splitAccountStr = (account) => {
    const [accountIdAndRole, accountName] = account.split(' - ');
    const [accountId, accountRole] = accountIdAndRole.split('/');
    return { accountName, accountId, accountRole, accountIdAndRole };
};
// Output example: AccountName ..... AccountId/AccountRole    :: Role
const formatAccountOutput = (account, role, maxAccountNameLength, maxAccountIdAndRoleLength) => {
    const { accountName, accountIdAndRole } = splitAccountStr(account);
    return [
        `${accountName} .`.padEnd(maxAccountNameLength + 2, '.'),
        accountIdAndRole.padEnd(maxAccountIdAndRoleLength, ' '),
        (0, getAccountDelim_1.getAccountDelim)(),
        role,
    ].join(' ');
};
const sortFavorites = (favorites) => (a, b) => Number(favorites.includes(b.account)) -
    Number(favorites.includes(a.account));
const sortAlphabetically = () => (a, b) => {
    const { accountName: aAccountName } = splitAccountStr(a.account);
    const { accountName: bAccountName } = splitAccountStr(b.account);
    return aAccountName.localeCompare(bAccountName);
};
function promptForAlksAccountAndRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opts = {
            iamOnly: options.iamOnly || false,
            prompt: options.prompt || 'Please select an ALKS account/role',
            filterFavorites: options.filterFavorites || false,
        };
        const alksAccounts = yield (0, getAlksAccounts_1.getAlksAccounts)({ iamOnly: opts.iamOnly });
        const favorites = yield (0, getFavorites_1.getFavorites)();
        (0, log_1.log)(`Favorites: ${favorites.toString()}`);
        const [maxAccountNameLength, maxAccountIdAndRoleLength] = alksAccounts.reduce((prev, alksAccount) => {
            const { accountName, accountIdAndRole } = splitAccountStr(alksAccount.account);
            return [
                Math.max(prev[0], accountName.length),
                Math.max(prev[1], accountIdAndRole.length),
            ];
        }, [0, 0]);
        const indexedAlksAccounts = alksAccounts
            .filter((alksAccount) => !opts.filterFavorites || favorites.includes(alksAccount.account)) // Filter out non-favorites if filterFavorites flag is passed
            .sort(sortAlphabetically()) // Sort alphabetically first
            .sort(sortFavorites(favorites)) // Move favorites to the front of the list, non-favorites to the back
            .map((alksAccount) => formatAccountOutput(alksAccount.account, alksAccount.role, maxAccountNameLength, maxAccountIdAndRoleLength)); // Convert ALKS account object to ALKS-CLI style account string
        if (!indexedAlksAccounts.length) {
            throw new Error('No accounts found.');
        }
        const promptData = {
            type: 'list',
            name: 'alksAccount',
            message: opts.prompt,
            choices: indexedAlksAccounts,
            pageSize: 15,
        };
        // Ignore failure since we're about to prompt for it
        const defaultAlksAccount = yield (0, alksAccount_1.getAlksAccount)();
        const defaultAlksRole = yield (0, alksRole_1.getAlksRole)();
        if (defaultAlksAccount && defaultAlksRole) {
            promptData.default = formatAccountOutput(defaultAlksAccount, defaultAlksRole, maxAccountNameLength, maxAccountIdAndRoleLength);
        }
        // ask user which account/role
        const prompt = (0, getStdErrPrompt_1.getStdErrPrompt)();
        const answers = yield prompt([promptData]);
        const acctStr = answers.alksAccount;
        // rebuild the account string to get the account and role
        const selectedAccountName = acctStr.split(' .')[0];
        const selectedAccountIdAndRole = acctStr.split('. ')[1].split(' ')[0];
        const selectedRole = acctStr.split((0, getAccountDelim_1.getAccountDelim)())[1].trim();
        return {
            alksAccount: `${selectedAccountIdAndRole} - ${selectedAccountName}`,
            alksRole: selectedRole,
        };
    });
}
exports.promptForAlksAccountAndRole = promptForAlksAccountAndRole;
//# sourceMappingURL=promptForAlksAccountAndRole.js.map