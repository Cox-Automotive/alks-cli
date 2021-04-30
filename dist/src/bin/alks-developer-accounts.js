#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
var getAlks_1 = require("../lib/getAlks");
var errorAndExit_1 = require("../lib/errorAndExit");
var getAccountRegex_1 = require("../lib/getAccountRegex");
var getAuth_1 = require("../lib/getAuth");
var getDeveloper_1 = require("../lib/getDeveloper");
var isWindows_1 = require("../lib/isWindows");
var log_1 = require("../lib/log");
var tractActivity_1 = require("../lib/tractActivity");
commander_1.default
    .version(package_json_1.default.version)
    .description('shows current developer configuration')
    .option('-v, --verbose', 'be verbose')
    .option('-e, --export', 'export accounts to environment variables')
    .parse(process.argv);
var table = new cli_table3_1.default({
    head: [
        cli_color_1.default.white.bold('Account'),
        cli_color_1.default.white.bold('Role'),
        cli_color_1.default.white.bold('Type'),
    ],
    colWidths: [50, 50, 25],
});
var logger = 'dev-accounts';
var doExport = commander_1.default.export;
var accountRegex = getAccountRegex_1.getAccountRegex();
var exportCmd = isWindows_1.isWindows() ? 'SET' : 'export';
var accounts = [];
function getUniqueAccountName(accountName) {
    var i = 1;
    var test = accountName;
    while (underscore_1.default.contains(accounts, test)) {
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
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, auth, alks, alksAccounts;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(commander_1.default, logger, 'getting developer');
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    log_1.log(commander_1.default, logger, 'getting auth');
                    return [4 /*yield*/, getAuth_1.getAuth(commander_1.default)];
                case 2:
                    auth = _a.sent();
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({ baseUrl: developer.server }, auth))];
                case 3:
                    alks = _a.sent();
                    log_1.log(commander_1.default, logger, 'getting alks accounts');
                    return [4 /*yield*/, alks.getAccounts()];
                case 4:
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
                    log_1.log(commander_1.default, logger, 'checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tractActivity_1.trackActivity(logger)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return errorAndExit_1.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-developer-accounts.js.map