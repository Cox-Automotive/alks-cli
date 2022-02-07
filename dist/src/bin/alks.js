#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var package_json_1 = require("../../package.json");
var configFolder_1 = require("../lib/configFolder");
var convertNetrcToIni_1 = require("../lib/convertNetrcToIni");
var handleCommanderError_1 = require("../lib/handlers/handleCommanderError");
var program_1 = tslib_1.__importDefault(require("../lib/program"));
var updateDbFileLocation_1 = require("../lib/updateDbFileLocation");
if (process.stdout.isTTY) {
    console.error(cli_color_1.default.whiteBright.bold('ALKS v%s'), package_json_1.version);
}
console.log('hello');
(function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, configFolder_1.ensureConfigFolderExists()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, convertNetrcToIni_1.convertNetrcToIni()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateDbFileLocation_1.updateDbFileLocation()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, program_1.default.parseAsync()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    // We need to catch in both ways because some errors are thrown and others are rejected promises
                    handleCommanderError_1.handleCommanderError(program_1.default, err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
})();
//# sourceMappingURL=alks.js.map