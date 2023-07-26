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
        const indexedAlksAccounts = alksAccounts
            .map((alksAccount) => [alksAccount.account, alksAccount.role].join((0, getAccountDelim_1.getAccountDelim)())) // Convert ALKS account object to ALKS-CLI style account string
            .filter((accountString) => !opts.filterFavorites || favorites.includes(accountString)) // Filter out non-favorites if filterFavorites flag is passed
            .sort((a, b) => Number(favorites.includes(b)) - Number(favorites.includes(a))); // Move favorites to the front of the list, non-favorites to the back
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
            promptData.default = [defaultAlksAccount, defaultAlksRole].join((0, getAccountDelim_1.getAccountDelim)());
        }
        // ask user which account/role
        const prompt = (0, getStdErrPrompt_1.getStdErrPrompt)();
        const answers = yield prompt([promptData]);
        const acctStr = answers.alksAccount;
        const data = acctStr.split((0, getAccountDelim_1.getAccountDelim)());
        const alksAccount = data[0];
        const alksRole = data[1];
        return {
            alksAccount,
            alksRole,
        };
    });
}
exports.promptForAlksAccountAndRole = promptForAlksAccountAndRole;
//# sourceMappingURL=promptForAlksAccountAndRole.js.map