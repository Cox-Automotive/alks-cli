#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var getOutputValues_1 = require("../lib/getOutputValues");
var alks_sessions_open_1 = require("../lib/handlers/alks-sessions-open");
var outputValues = getOutputValues_1.getOutputValues();
commander_1.default
    .version(package_json_1.default.version)
    .description('creates or resumes a session')
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-p, --password [password]', 'my password')
    .option('-o, --output [format]', 'output format (' + outputValues.join(', ') + ')')
    .option('-n, --namedProfile [profile]', 'if output is set to creds, use this profile, default: default')
    .option('-f, --force', 'if output is set to creds, force overwriting of AWS credentials')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_sessions_open_1.handleAlksSessionsOpen(commander_1.default);
//# sourceMappingURL=alks-sessions-open.js.map