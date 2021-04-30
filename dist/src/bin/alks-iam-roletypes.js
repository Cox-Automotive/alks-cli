#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_iam_roletypes_1 = require("../lib/handlers/alks-iam-roletypes");
var outputVals = ['list', 'json'];
commander_1.default
    .version(package_json_1.default.version)
    .description('list the available iam role types')
    .option('-o, --output [format]', 'output format (' + outputVals.join(', ') + '), default: ' + outputVals[0], outputVals[0])
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_iam_roletypes_1.handleAlksIamRoleTypes(commander_1.default);
//# sourceMappingURL=alks-iam-roletypes.js.map