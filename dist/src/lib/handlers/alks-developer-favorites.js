"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperFavorites = void 0;
var tslib_1 = require("tslib");
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAccountDelim_1 = require("../getAccountDelim");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var getFavorites_1 = require("../getFavorites");
var log_1 = require("../log");
var saveFavorites_1 = require("../saveFavorites");
function handleAlksDeveloperFavorites(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var auth, alks, alksAccounts, favorites_1, choices_1, deferred_1, faves, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    log_1.log('getting auth');
                    return [4 /*yield*/, getAuth_1.getAuth()];
                case 1:
                    auth = _a.sent();
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({}, auth))];
                case 2:
                    alks = _a.sent();
                    log_1.log('getting alks accounts');
                    return [4 /*yield*/, alks.getAccounts()];
                case 3:
                    alksAccounts = _a.sent();
                    log_1.log('getting favorite accounts');
                    return [4 /*yield*/, getFavorites_1.getFavorites()];
                case 4:
                    favorites_1 = _a.sent();
                    choices_1 = [];
                    deferred_1 = [];
                    log_1.log('rendering favorite accounts');
                    choices_1.push(new inquirer_1.default.Separator(' = Standard = '));
                    alksAccounts.forEach(function (alksAccount) {
                        if (!alksAccount.iamKeyActive) {
                            var name = [alksAccount.account, alksAccount.role].join(getAccountDelim_1.getAccountDelim());
                            choices_1.push({
                                name: name,
                                checked: underscore_1.contains(favorites_1, name),
                            });
                        }
                        else {
                            deferred_1.push(alksAccount);
                        }
                    });
                    choices_1.push(new inquirer_1.default.Separator(' = IAM = '));
                    deferred_1.forEach(function (val) {
                        var name = [val.account, val.role].join(getAccountDelim_1.getAccountDelim());
                        choices_1.push({
                            name: name,
                            checked: underscore_1.contains(favorites_1, name),
                        });
                    });
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'checkbox',
                                message: 'Select favorites',
                                name: 'favorites',
                                choices: choices_1,
                                pageSize: 25,
                            },
                        ])];
                case 5:
                    faves = _a.sent();
                    return [4 /*yield*/, saveFavorites_1.saveFavorites({ accounts: faves })];
                case 6:
                    _a.sent();
                    console.log('Favorites have been saved!');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperFavorites = handleAlksDeveloperFavorites;
//# sourceMappingURL=alks-developer-favorites.js.map