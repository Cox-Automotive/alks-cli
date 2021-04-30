#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_sessions_console_1 = require("../lib/handlers/alks-sessions-console");
commander_1.default
    .version(package_json_1.default.version)
    .description('open an AWS console in your browser')
    .option('-u, --url', 'just print the url')
    .option('-o, --openWith [appName]', 'open in a different app (optional)')
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-p, --password [password]', 'my password')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_sessions_console_1.handleAlksSessionsConsole(commander_1.default);
//# sourceMappingURL=alks-sessions-console.js.map