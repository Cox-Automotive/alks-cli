"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForAlksAccountAndRole = void 0;
var tslib_1 = require("tslib");
var getAccountDelim_1 = require("./getAccountDelim");
var getAlks_1 = require("./getAlks");
var getAuth_1 = require("./getAuth");
var getFavorites_1 = require("./getFavorites");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
var log_1 = require("./log");
var alksAccount_1 = require("./state/alksAccount");
var alksRole_1 = require("./state/alksRole");
function promptForAlksAccountAndRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var opts, auth, alks, alksAccounts, favorites, indexedAlksAccounts, promptData, defaultAlksAccount, defaultAlksRole, prompt, answers, acctStr, data, alksAccount, alksRole;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('retreiving alks account');
                    opts = {
                        iamOnly: options.iamOnly || false,
                        prompt: options.prompt || 'Please select an ALKS account/role',
                        filterFavorites: options.filterFavorites || false,
                    };
                    return [4 /*yield*/, getAuth_1.getAuth()];
                case 1:
                    auth = _a.sent();
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({}, auth))];
                case 2:
                    alks = _a.sent();
                    return [4 /*yield*/, alks.getAccounts()];
                case 3:
                    alksAccounts = _a.sent();
                    log_1.log("All accounts: " + alksAccounts.map(function (alksAccount) { return alksAccount.account; }));
                    return [4 /*yield*/, getFavorites_1.getFavorites()];
                case 4:
                    favorites = _a.sent();
                    log_1.log("Favorites: " + favorites.toString());
                    indexedAlksAccounts = alksAccounts
                        .filter(function (alksAccount) { return !opts.iamOnly || alksAccount.iamKeyActive; }) // Filter out non-iam-active accounts if iamOnly flag is passed
                        .map(function (alksAccount) {
                        return [alksAccount.account, alksAccount.role].join(getAccountDelim_1.getAccountDelim());
                    }) // Convert ALKS account object to ALKS-CLI style account string
                        .filter(function (accountString) {
                        return !opts.filterFavorites || favorites.includes(accountString);
                    }) // Filter out non-favorites if filterFavorites flag is passed
                        .sort(function (a, b) { return Number(favorites.includes(b)) - Number(favorites.includes(a)); });
                    if (!indexedAlksAccounts.length) {
                        throw new Error('No accounts found.');
                    }
                    promptData = {
                        type: 'list',
                        name: 'alksAccount',
                        message: opts.prompt,
                        choices: indexedAlksAccounts,
                        pageSize: 15,
                    };
                    return [4 /*yield*/, alksAccount_1.getAlksAccount().catch(function () { return undefined; })];
                case 5:
                    defaultAlksAccount = _a.sent();
                    return [4 /*yield*/, alksRole_1.getAlksRole().catch(function () { return undefined; })];
                case 6:
                    defaultAlksRole = _a.sent();
                    if (defaultAlksAccount && defaultAlksRole) {
                        promptData.default = [defaultAlksAccount, defaultAlksRole].join(getAccountDelim_1.getAccountDelim());
                    }
                    prompt = getStdErrPrompt_1.getStdErrPrompt();
                    return [4 /*yield*/, prompt([promptData])];
                case 7:
                    answers = _a.sent();
                    acctStr = answers.alksAccount;
                    data = acctStr.split(getAccountDelim_1.getAccountDelim());
                    alksAccount = data[0];
                    alksRole = data[1];
                    return [2 /*return*/, {
                            alksAccount: alksAccount,
                            alksRole: alksRole,
                        }];
            }
        });
    });
}
exports.promptForAlksAccountAndRole = promptForAlksAccountAndRole;
//# sourceMappingURL=promptForAlksAccountAndRole.js.map