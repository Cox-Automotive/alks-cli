"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForAlksAccountAndRole = void 0;
const tslib_1 = require("tslib");
const getAlksAccounts_1 = require("./getAlksAccounts");
const getFavorites_1 = require("./getFavorites");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
const log_1 = require("./log");
const alksAccount_1 = require("./state/alksAccount");
const alksRole_1 = require("./state/alksRole");
const parseAlksAccount_1 = require("./parseAlksAccount");
const formatAccountOutput_1 = require("./formatAccountOutput");
const compareAliasesAlphabetically_1 = require("./compareAliasesAlphabetically");
const compareFavorites_1 = require("./compareFavorites");
const getAccountDelim_1 = require("./getAccountDelim");
function promptForAlksAccountAndRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opts = {
            iamOnly: options.iamOnly || false,
            prompt: options.prompt || 'Please select an ALKS account/role',
            filterFavorites: options.filterFavorites || false,
        };
        const alksAccounts = (yield (0, getAlksAccounts_1.getAlksAccounts)({ iamOnly: opts.iamOnly })).map(parseAlksAccount_1.parseAlksAccount);
        const favorites = yield (0, getFavorites_1.getFavorites)();
        (0, log_1.log)(`Favorites: ${favorites.toString()}`);
        const maxAccountAliasLength = Math.max(...alksAccounts.map((a) => a.accountAlias.length));
        const maxAccountIdAndRoleLength = Math.max(...alksAccounts.map((a) => a.accountIdAndRole.length));
        const indexedAlksAccounts = alksAccounts
            .filter((alksAccount) => !opts.filterFavorites ||
            favorites.includes([alksAccount.account, alksAccount.role].join((0, getAccountDelim_1.getAccountDelim)()))) // Filter out non-favorites if filterFavorites flag is passed
            .sort((0, compareAliasesAlphabetically_1.compareAliasesAlphabetically)()) // Sort alphabetically first
            .sort((0, compareFavorites_1.compareFavorites)(favorites)) // Move favorites to the front of the list, non-favorites to the back
            .map((alksAccount) => (Object.assign(Object.assign({}, alksAccount), { formattedOutput: (0, formatAccountOutput_1.formatAccountOutput)(alksAccount, maxAccountAliasLength, maxAccountIdAndRoleLength) }))); // Add a field to the account object containing the formatted output string
        if (!indexedAlksAccounts.length) {
            throw new Error('No accounts found.');
        }
        const promptData = {
            type: 'list',
            name: 'alksAccount',
            message: opts.prompt,
            choices: indexedAlksAccounts.map((a) => a.formattedOutput),
            pageSize: 15,
        };
        // Ignore failure since we're about to prompt for it
        const defaultAlksAccount = yield (0, alksAccount_1.getAlksAccount)();
        const defaultAlksRole = yield (0, alksRole_1.getAlksRole)();
        // If a default account and role are set and they match an account the user has, find the corresponding formatted output string
        if (defaultAlksAccount && defaultAlksRole) {
            const defaultAccount = indexedAlksAccounts.find((account) => account.account === defaultAlksAccount &&
                account.role === defaultAlksRole);
            if (defaultAccount) {
                promptData.default = defaultAccount.formattedOutput;
            }
        }
        // ask user which account/role
        const prompt = (0, getStdErrPrompt_1.getStdErrPrompt)();
        const answers = yield prompt([promptData]);
        const selectedString = answers.alksAccount;
        const selectedAccount = indexedAlksAccounts.find((account) => account.formattedOutput === selectedString);
        if (!selectedAccount) {
            (0, log_1.log)(`Selected account "${selectedString}" not found in the list of accounts.`);
            throw new Error('Account selection failed. The selected account was not found.');
        }
        return {
            alksAccount: selectedAccount.account,
            alksRole: selectedAccount.role,
        };
    });
}
exports.promptForAlksAccountAndRole = promptForAlksAccountAndRole;
//# sourceMappingURL=promptForAlksAccountAndRole.js.map