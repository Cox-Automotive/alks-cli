#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var utils_1 = require("../lib/utils");
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
commander_1.default
    .version(package_json_1.default.version)
    .command('createrole', 'create IAM role')
    .command('createtrustrole', 'create IAM trust role')
    .command('deleterole', 'remove an IAM role')
    .command('roletypes', 'list the available iam role types')
    .command('createltk', 'create a longterm key')
    .command('deleteltk', 'delete a longterm key')
    .parse(process.argv);
utils_1.subcommandSuggestion(commander_1.default, 'iam');
//# sourceMappingURL=alks-iam.js.map