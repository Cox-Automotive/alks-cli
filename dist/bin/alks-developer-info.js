#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
var utils_1 = require("../lib/utils");
var developer_1 = require("../lib/developer");
commander_1.default
    .version(package_json_1.default.version)
    .description('shows current developer configuration')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var table = new cli_table3_1.default({
    head: [cli_color_1.default.white.bold('Key'), cli_color_1.default.white.bold('Value')],
    colWidths: [25, 50],
});
var logger = 'dev-info';
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, password, token, ignores, mapping, tablePassword, tableToken;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(commander_1.default, logger, 'getting developer');
                    return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    utils_1.log(commander_1.default, logger, 'getting password');
                    return [4 /*yield*/, developer_1.getPassword(null)];
                case 2:
                    password = _a.sent();
                    utils_1.log(commander_1.default, logger, 'getting 2fa token');
                    return [4 /*yield*/, developer_1.getToken()];
                case 3:
                    token = _a.sent();
                    ignores = ['lastVersion'];
                    mapping = {
                        server: 'ALKS Server',
                        userid: 'Network Login',
                        alksAccount: 'Default ALKS Account',
                        alksRole: 'Default ALKS Role',
                        outputFormat: 'Default Output Format',
                    };
                    underscore_1.default.each(developer, function (val, key) {
                        if (!underscore_1.default.contains(ignores, key)) {
                            table.push([mapping[key], underscore_1.default.isEmpty(val) ? '' : val]);
                        }
                    });
                    tablePassword = !underscore_1.default.isEmpty(password)
                        ? '**********'
                        : cli_color_1.default.red('NOT SET');
                    table.push(['Password', tablePassword]);
                    tableToken = !underscore_1.default.isEmpty(token)
                        ? token.substring(0, 4) + '**********'
                        : cli_color_1.default.red('NOT SET');
                    table.push(['2FA Token', tableToken]);
                    console.error(cli_color_1.default.white.underline.bold('\nDeveloper Configuration'));
                    console.log(cli_color_1.default.white(table.toString()));
                    utils_1.log(commander_1.default, logger, 'checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, developer_1.trackActivity(logger)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils_1.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-developer-info.js.map