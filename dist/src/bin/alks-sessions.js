#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_sessions_1 = require("../lib/handlers/alks-sessions");
commander_1.default
    .version(package_json_1.default.version)
    .command('open', 'creates or resumes a session')
    .command('list', 'lists active sessions')
    .command('console', 'open an AWS console in your browser')
    .parse(process.argv);
alks_sessions_1.handleAlksSessions(commander_1.default);
//# sourceMappingURL=alks-sessions.js.map