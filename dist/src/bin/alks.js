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
var log_1 = require("../lib/log");
if (process.stdout.isTTY) {
    console.error(cli_color_1.default.whiteBright.bold('ALKS v%s'), package_json_1.version);
}
(function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var startTime, programStartTime, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = new Date();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, configFolder_1.ensureConfigFolderExists)()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, convertNetrcToIni_1.convertNetrcToIni)()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, updateDbFileLocation_1.updateDbFileLocation)()];
                case 4:
                    _a.sent();
                    programStartTime = new Date();
                    return [4 /*yield*/, program_1.default.parseAsync()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    logTime(startTime, programStartTime);
                    // We need to catch in both ways because some errors are thrown and others are rejected promises
                    (0, handleCommanderError_1.handleCommanderError)(program_1.default, err_1);
                    return [3 /*break*/, 7];
                case 7:
                    logTime(startTime, programStartTime);
                    return [2 /*return*/];
            }
        });
    });
})();
function logTime(start, programStart) {
    var now = new Date();
    (0, log_1.log)("time elapsed since start: ".concat(now.getTime() - start.getTime()));
    if (programStart) {
        (0, log_1.log)("time elapsed while parsing program: ".concat(now.getTime() - programStart.getTime()));
    }
}
//# sourceMappingURL=alks.js.map