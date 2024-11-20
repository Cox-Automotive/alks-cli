#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
process.title = 'ALKS';
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const package_json_1 = require("../../package.json");
const configFolder_1 = require("../lib/configFolder");
const convertNetrcToIni_1 = require("../lib/convertNetrcToIni");
const handleCommanderError_1 = require("../lib/handlers/handleCommanderError");
const program_1 = tslib_1.__importDefault(require("../lib/program"));
const updateDbFileLocation_1 = require("../lib/updateDbFileLocation");
const log_1 = require("../lib/log");
if (process.stdout.isTTY) {
    console.error(cli_color_1.default.whiteBright.bold('ALKS v%s'), package_json_1.version);
}
(function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const startTime = new Date();
        let programStartTime;
        try {
            yield (0, configFolder_1.ensureConfigFolderExists)();
            yield (0, log_1.initLogs)();
            yield (0, convertNetrcToIni_1.convertNetrcToIni)();
            yield (0, updateDbFileLocation_1.updateDbFileLocation)();
            programStartTime = new Date();
            yield program_1.default.parseAsync();
        }
        catch (err) {
            logTime(startTime, programStartTime);
            // We need to catch in both ways because some errors are thrown and others are rejected promises
            (0, handleCommanderError_1.handleCommanderError)(program_1.default, err);
        }
        logTime(startTime, programStartTime);
    });
})();
function logTime(start, programStart) {
    const now = new Date();
    (0, log_1.log)(`time elapsed since start: ${now.getTime() - start.getTime()}`);
    if (programStart) {
        (0, log_1.log)(`time elapsed while parsing program: ${now.getTime() - programStart.getTime()}`);
    }
}
//# sourceMappingURL=alks.js.map