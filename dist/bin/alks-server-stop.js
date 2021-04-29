#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var forever_1 = tslib_1.__importDefault(require("forever"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var utils_1 = require("../lib/utils");
commander_1.default
    .version(package_json_1.default.version)
    .description('stops the metadata server')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
if (!utils_1.isOSX()) {
    console.error(cli_color_1.default.red('The metadata server is only supported on OSX.'));
    process.exit(0);
}
console.error(cli_color_1.default.white('Stopping metadata server..'));
forever_1.default.list(false, function (_err, list) {
    if (list === null) {
        console.log(cli_color_1.default.white('Metadata server is not running.'));
    }
    else {
        forever_1.default.stopAll();
        console.log(cli_color_1.default.white('Metadata server stopped.'));
    }
});
//# sourceMappingURL=alks-server-stop.js.map