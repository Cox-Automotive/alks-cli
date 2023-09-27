"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperAccounts = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const underscore_1 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAccountRegex_1 = require("../getAccountRegex");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const isWindows_1 = require("../isWindows");
const log_1 = require("../log");
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
const getOutputValues_1 = require("../getOutputValues");
function handleAlksDeveloperAccounts(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const outputVals = (0, getOutputValues_1.getOutputValuesAccounts)();
        const output = options.output;
        if (!(0, underscore_1.contains)(outputVals, output)) {
            (0, errorAndExit_1.errorAndExit)('The output provided (' +
                output +
                ') is not in the allowed values: ' +
                outputVals.join(', '));
        }
        const outputObj = output == 'json'
            ? []
            : (new cli_table3_1.default({
                head: [
                    cli_color_1.default.white.bold('Account'),
                    cli_color_1.default.white.bold('Role'),
                    cli_color_1.default.white.bold('Type'),
                ],
                colWidths: [50, 50, 25],
            }));
        const doExport = options.export;
        const accountRegex = (0, getAccountRegex_1.getAccountRegex)();
        const exportCmd = (0, isWindows_1.isWindows)() ? 'SET' : 'export';
        const accounts = [];
        function getUniqueAccountName(accountName) {
            let i = 1;
            let test = accountName;
            while ((0, underscore_1.contains)(accounts, test)) {
                test = accountName + i++;
            }
            return test;
        }
        function accountExport(account) {
            let match;
            while ((match = accountRegex.exec(account))) {
                if (match && account.indexOf('ALKS_') === -1) {
                    // ignore legacy accounts
                    const accountName = getUniqueAccountName([match[6].toLowerCase(), match[4].toLowerCase()].join('_'));
                    accounts.push(accountName);
                    console.log(exportCmd + ' ' + accountName + '="' + account + '"');
                }
            }
        }
        try {
            (0, log_1.log)('getting auth');
            const auth = yield (0, getAuth_1.getAuth)();
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            (0, log_1.log)('getting alks accounts');
            const alksAccounts = yield alks.getAccounts();
            alksAccounts.forEach((alksAccount) => {
                const data = [alksAccount.account, alksAccount.role];
                if (doExport) {
                    accountExport(data[0]);
                }
                else {
                    outputObj.push(data.concat(alksAccount.iamKeyActive ? 'IAM' : 'Standard'));
                }
            });
            if (!doExport) {
                if (output == 'json') {
                    const accountsOutput = {};
                    outputObj.forEach((accountRolePair) => {
                        const accountId = accountRolePair[0].split('/')[0];
                        if (!(accountId in accountsOutput)) {
                            accountsOutput[accountId] = {
                                accountAlias: accountRolePair[0].split('- ')[1],
                                roles: [{ role: accountRolePair[1], isIamActive: accountRolePair[2] == "IAM" }]
                            };
                        }
                        else {
                            accountsOutput[accountId].roles.push({ role: accountRolePair[1], isIamActive: accountRolePair[2] == "IAM" });
                        }
                    });
                    console.log(JSON.stringify(accountsOutput));
                }
                else {
                    console.error(cli_color_1.default.white.underline.bold('\nAvailable Accounts'));
                    console.log(cli_color_1.default.white(outputObj.toString()));
                }
            }
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksDeveloperAccounts = handleAlksDeveloperAccounts;
//# sourceMappingURL=alks-developer-accounts.js.map