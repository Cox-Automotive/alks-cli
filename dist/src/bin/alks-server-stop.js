#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_server_stop_1 = require("../lib/handlers/alks-server-stop");
commander_1.default
    .version(package_json_1.default.version)
    .description('stops the metadata server')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_server_stop_1.handleAlksServerStop(commander_1.default);
//# sourceMappingURL=alks-server-stop.js.map