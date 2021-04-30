#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_server_1 = require("../lib/handlers/alks-server");
commander_1.default
    .version(package_json_1.default.version)
    .command('configure', 'configures the alks ec2 metadata server')
    .command('start', 'starts the alks ec2 metadata server')
    .command('stop', 'stops the alks ec2 metadat server')
    .parse(process.argv);
alks_server_1.handleAlksServer(commander_1.default);
//# sourceMappingURL=alks-server.js.map