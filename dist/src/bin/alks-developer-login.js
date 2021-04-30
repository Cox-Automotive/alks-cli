#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_developer_login_1 = require("../lib/handlers/alks-developer-login");
commander_1.default
    .version(package_json_1.default.version)
    .description('stores password')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_developer_login_1.handleAlksDeveloperLogin(commander_1.default);
//# sourceMappingURL=alks-developer-login.js.map