#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.title = 'ALKS';
var alks_sessions_1 = require("../lib/handlers/alks-sessions");
var program_1 = require("../lib/program");
program_1.program
    .command('open', 'creates or resumes a session')
    .command('list', 'lists active sessions')
    .command('console', 'open an AWS console in your browser')
    .parse(process.argv);
alks_sessions_1.handleAlksSessions(program_1.program);
//# sourceMappingURL=alks-sessions.js.map