#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var package_json_1 = require("../../package.json");
var handleCommanderError_1 = require("../lib/handlers/handleCommanderError");
var program_1 = tslib_1.__importDefault(require("../lib/program"));
if (process.stdout.isTTY) {
    console.error(cli_color_1.default.whiteBright.bold('ALKS v%s'), package_json_1.version);
}
try {
    program_1.default.parse();
}
catch (err) {
    handleCommanderError_1.handleCommanderError(program_1.default, err);
}
//# sourceMappingURL=alks.js.map