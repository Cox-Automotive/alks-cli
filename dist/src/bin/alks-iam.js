#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_iam_1 = require("../lib/handlers/alks-iam");
commander_1.default
    .version(package_json_1.default.version)
    .command('createrole', 'create IAM role')
    .command('createtrustrole', 'create IAM trust role')
    .command('deleterole', 'remove an IAM role')
    .command('roletypes', 'list the available iam role types')
    .command('createltk', 'create a longterm key')
    .command('deleteltk', 'delete a longterm key')
    .parse(process.argv);
alks_iam_1.handleAlksIam(commander_1.default);
//# sourceMappingURL=alks-iam.js.map