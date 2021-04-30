#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_sessions_list_1 = require("../lib/handlers/alks-sessions-list");
commander_1.default
    .version(package_json_1.default.version)
    .description('list active sessions')
    .option('-p, --password [password]', 'my password')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_sessions_list_1.handleSessionsList(commander_1.default);
//# sourceMappingURL=alks-sessions-list.js.map