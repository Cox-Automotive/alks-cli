#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_1 = require("../lib/handlers/alks");
commander_1.default
    .command('sessions', 'manage aws sessions')
    .command('iam', 'manage iam resources')
    .command('developer', 'developer & account commands')
    .command('server', 'ec2 metadata server')
    .version(package_json_1.default.version)
    .parse(process.argv);
alks_1.handleAlks(commander_1.default);
//# sourceMappingURL=alks.js.map