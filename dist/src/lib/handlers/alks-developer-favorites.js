"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperFavorites = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const underscore_1 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAccountDelim_1 = require("../getAccountDelim");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const getFavorites_1 = require("../getFavorites");
const log_1 = require("../log");
const saveFavorites_1 = require("../saveFavorites");
function handleAlksDeveloperFavorites(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            (0, log_1.log)('getting auth');
            const auth = yield (0, getAuth_1.getAuth)();
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            (0, log_1.log)('getting alks accounts');
            const alksAccounts = yield alks.getAccounts();
            (0, log_1.log)('getting favorite accounts');
            const favorites = yield (0, getFavorites_1.getFavorites)();
            const choices = [];
            const deferred = [];
            (0, log_1.log)('rendering favorite accounts');
            choices.push(new inquirer_1.default.Separator(' = Standard = '));
            alksAccounts.forEach((alksAccount) => {
                if (!alksAccount.iamKeyActive) {
                    const name = [alksAccount.account, alksAccount.role].join((0, getAccountDelim_1.getAccountDelim)());
                    choices.push({
                        name,
                        checked: (0, underscore_1.contains)(favorites, name),
                    });
                }
                else {
                    deferred.push(alksAccount);
                }
            });
            choices.push(new inquirer_1.default.Separator(' = IAM = '));
            deferred.forEach((val) => {
                const name = [val.account, val.role].join((0, getAccountDelim_1.getAccountDelim)());
                choices.push({
                    name,
                    checked: (0, underscore_1.contains)(favorites, name),
                });
            });
            const faves = yield inquirer_1.default.prompt([
                {
                    type: 'checkbox',
                    message: 'Select favorites',
                    name: 'favorites',
                    choices,
                    pageSize: 25,
                },
            ]);
            yield (0, saveFavorites_1.saveFavorites)({ accounts: faves });
            console.log('Favorites have been saved!');
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksDeveloperFavorites = handleAlksDeveloperFavorites;
//# sourceMappingURL=alks-developer-favorites.js.map