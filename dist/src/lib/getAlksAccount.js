"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlksAccount = void 0;
var tslib_1 = require("tslib");
var getAccountDelim_1 = require("./getAccountDelim");
var getAlks_1 = require("./getAlks");
var getAuth_1 = require("./getAuth");
var getDeveloper_1 = require("./getDeveloper");
var getFavorites_1 = require("./getFavorites");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
var log_1 = require("./log");
var logger = 'getAlksAccount';
function getAlksAccount(program, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, e_1, opts, auth, alks, alksAccounts, favorites, indexedAlksAccounts, promptData, prompt, answers, acctStr, data, alksAccount, alksRole;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(program, logger, 'retreiving alks account');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 2:
                    developer = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    opts = {
                        iamOnly: options.iamOnly || false,
                        prompt: options.prompt || 'Please select an ALKS account/role',
                        filterFavorites: options.filterFavorites || false,
                        server: options.server || (developer === null || developer === void 0 ? void 0 : developer.server),
                    };
                    if (!opts.server) {
                        throw new Error('No server URL configured');
                    }
                    return [4 /*yield*/, getAuth_1.getAuth(program)];
                case 5:
                    auth = _a.sent();
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({ baseUrl: opts.server }, auth))];
                case 6:
                    alks = _a.sent();
                    return [4 /*yield*/, alks.getAccounts()];
                case 7:
                    alksAccounts = _a.sent();
                    return [4 /*yield*/, getFavorites_1.getFavorites()];
                case 8:
                    favorites = _a.sent();
                    indexedAlksAccounts = alksAccounts
                        .filter(function (alksAccount) { return !opts.iamOnly || alksAccount.iamKeyActive; }) // Filter out non-iam-active accounts if iamOnly flag is passed
                        .filter(function (alksAccount) {
                        return !opts.filterFavorites || favorites.includes(alksAccount.account);
                    }) // Filter out non-favorites if filterFavorites flag is passed
                        .sort(function (a, b) {
                        return Number(favorites.includes(b.account)) -
                            Number(favorites.includes(a.account));
                    }) // Move favorites to the front of the list, non-favorites to the back
                        .map(function (alksAccount) {
                        return [alksAccount.account, alksAccount.role].join(getAccountDelim_1.getAccountDelim());
                    });
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
                    if (developer) {
                        promptData.default = [developer.alksAccount, developer.alksRole].join(getAccountDelim_1.getAccountDelim());
                    }
                    prompt = getStdErrPrompt_1.getStdErrPrompt();
                    return [4 /*yield*/, prompt([promptData])];
                case 9:
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
exports.getAlksAccount = getAlksAccount;
//# sourceMappingURL=getAlksAccount.js.map