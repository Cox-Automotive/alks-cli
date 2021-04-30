#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_server_start_1 = require("../lib/handlers/alks-server-start");
commander_1.default
    .version(package_json_1.default.version)
    .description('starts the metadata server')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_server_start_1.handleAlksServerStart(commander_1.default);
//# sourceMappingURL=alks-server-start.js.map