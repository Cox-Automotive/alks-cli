#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var utils = tslib_1.__importStar(require("../lib/utils"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
commander_1.default
    .version(package_json_1.default.version)
    .command('configure', 'configures developer')
    .command('accounts', 'shows available account/roles')
    .command('favorites', 'configure which accounts are favorites')
    .command('info', 'shows current developer configuration')
    .command('login', 'stores password')
    .command('logout', 'removes password')
    .command('login2fa', 'stores your alks refresh token')
    .command('logout2fa', 'removes your alks refresh token')
    .parse(process.argv);
utils.subcommandSuggestion(commander_1.default, 'developer');
//# sourceMappingURL=alks-developer.js.map