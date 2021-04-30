#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_iam_createltk_1 = require("../lib/handlers/alks-iam-createltk");
var nameDesc = 'alphanumeric including @+=._-';
commander_1.default
    .version(package_json_1.default.version)
    .description('creates a new IAM Longterm Key')
    .option('-n, --iamusername [iamUsername]', 'the name of the iam user associated with the LTK, ' + nameDesc)
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-o, --output [format]', 'output format (text, json)', 'text')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_iam_createltk_1.handleAlksIamCreateLtk(commander_1.default);
//# sourceMappingURL=alks-iam-createltk.js.map