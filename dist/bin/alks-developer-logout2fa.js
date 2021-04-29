#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
var utils_1 = require("../lib/utils");
var developer_1 = require("../lib/developer");
commander_1.default
    .version(package_json_1.default.version)
    .description('removes alks refresh token')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var logger = 'dev-logout2fa';
if (developer_1.removeToken()) {
    console.error(cli_color_1.default.white('Token removed!'));
}
else {
    console.error(cli_color_1.default.red.bold('Error removing token!'));
}
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, developer_1.trackActivity(logger)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils_1.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-developer-logout2fa.js.map