"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperAccounts = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAccountRegex_1 = require("../getAccountRegex");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var getDeveloper_1 = require("../getDeveloper");
var isWindows_1 = require("../isWindows");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
function handleAlksDeveloperAccounts(options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function getUniqueAccountName(accountName) {
            var i = 1;
            var test = accountName;
            while (underscore_1.contains(accounts, test)) {
                test = accountName + i++;
            }
            return test;
        }
        function accountExport(account) {
            var match;
            while ((match = accountRegex.exec(account))) {
                if (match && account.indexOf('ALKS_') === -1) {
                    // ignore legacy accounts
                    var accountName = getUniqueAccountName([match[6].toLowerCase(), match[4].toLowerCase()].join('_'));
                    accounts.push(accountName);
                    console.log(exportCmd + ' ' + accountName + '="' + account + '"');
                }
            }
        }
        var table, doExport, accountRegex, exportCmd, accounts, developer, auth, alks, alksAccounts, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: throw new Error('this is an error');
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    log_1.log('getting developer');
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 2:
                    developer = _a.sent();
                    log_1.log('getting auth');
                    return [4 /*yield*/, getAuth_1.getAuth(program)];
                case 3:
                    auth = _a.sent();
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({ baseUrl: developer.server }, auth))];
                case 4:
                    alks = _a.sent();
                    log_1.log('getting alks accounts');
                    return [4 /*yield*/, alks.getAccounts()];
                case 5:
                    alksAccounts = _a.sent();
                    alksAccounts.forEach(function (alksAccount) {
                        var data = [alksAccount.account, alksAccount.role];
                        if (doExport) {
                            accountExport(data[0]);
                        }
                        else {
                            table.push(data.concat(alksAccount.iamKeyActive ? 'IAM' : 'Standard'));
                        }
                    });
                    if (!doExport) {
                        console.error(cli_color_1.default.white.underline.bold('\nAvailable Accounts'));
                        console.log(cli_color_1.default.white(table.toString()));
                    }
                    log_1.log('checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
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
exports.handleAlksDeveloperAccounts = handleAlksDeveloperAccounts;
//# sourceMappingURL=alks-developer-accounts.js.map