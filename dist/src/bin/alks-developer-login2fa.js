#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_developer_login2fa_1 = require("../lib/handlers/alks-developer-login2fa");
commander_1.default
    .version(package_json_1.default.version)
    .description('stores your alks refresh token')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_developer_login2fa_1.handleAlksDeveloperLogin2fa(commander_1.default);
//# sourceMappingURL=alks-developer-login2fa.js.map