#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.title = 'ALKS';
var getOutputValues_1 = require("../lib/getOutputValues");
var alks_sessions_open_1 = require("../lib/handlers/alks-sessions-open");
var program_1 = require("../lib/program");
var outputValues = getOutputValues_1.getOutputValues();
program_1.program
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
    .parse(process.argv);
alks_sessions_open_1.handleAlksSessionsOpen(program_1.program);
//# sourceMappingURL=alks-sessions-open.js.map