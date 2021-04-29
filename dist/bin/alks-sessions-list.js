#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
var moment_1 = tslib_1.__importDefault(require("moment"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
var developer_1 = require("../lib/developer");
var utils_1 = require("../lib/utils");
var keys_1 = require("../lib/keys");
commander_1.default
    .version(package_json_1.default.version)
    .description('list active sessions')
    .option('-p, --password [password]', 'my password')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var logger = 'sessions-list';
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var auth, nonIamKeys, iamKeys, foundKeys, table, groupedKeys;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.ensureConfigured()];
                case 1:
                    _a.sent();
                    utils_1.log(commander_1.default, logger, 'getting auth');
                    return [4 /*yield*/, developer_1.getAuth(commander_1.default)];
                case 2:
                    auth = _a.sent();
                    utils_1.log(commander_1.default, logger, 'getting existing sesions');
                    return [4 /*yield*/, keys_1.getKeys(auth, false)];
                case 3:
                    nonIamKeys = _a.sent();
                    utils_1.log(commander_1.default, logger, 'getting existing iam sesions');
                    return [4 /*yield*/, keys_1.getKeys(auth, true)];
                case 4:
                    iamKeys = _a.sent();
                    foundKeys = tslib_1.__spreadArray(tslib_1.__spreadArray([], nonIamKeys), iamKeys);
                    table = new cli_table3_1.default({
                        head: [
                            cli_color_1.default.white.bold('Access Key'),
                            cli_color_1.default.white.bold('Secret Key'),
                            cli_color_1.default.white.bold('Type'),
                            cli_color_1.default.white.bold('Expires'),
                            cli_color_1.default.white.bold('Created'),
                        ],
                        colWidths: [25, 25, 10, 25, 25],
                    });
                    groupedKeys = underscore_1.default.groupBy(foundKeys, 'alksAccount');
                    underscore_1.default.each(groupedKeys, function (keys, alksAccount) {
                        table.push([
                            { colSpan: 4, content: cli_color_1.default.yellow.bold('ALKS Account: ' + alksAccount) },
                        ]);
                        underscore_1.default.each(keys, function (keydata) {
                            console.log(JSON.stringify(keydata, null, 2));
                            table.push([
                                utils_1.obfuscate(keydata.accessKey),
                                utils_1.obfuscate(keydata.secretKey),
                                keydata.isIAM ? 'IAM' : 'Standard',
                                moment_1.default(keydata.expires).calendar(),
                                moment_1.default(keydata.meta.created).fromNow(),
                            ]);
                        });
                    });
                    if (!foundKeys.length) {
                        table.push([
                            { colSpan: 5, content: cli_color_1.default.yellow.bold('No active sessions found.') },
                        ]);
                    }
                    console.error(cli_color_1.default.white.underline.bold('Active Sessions'));
                    console.log(cli_color_1.default.white(table.toString()));
                    utils_1.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, developer_1.trackActivity(logger)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils_1.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-sessions-list.js.map