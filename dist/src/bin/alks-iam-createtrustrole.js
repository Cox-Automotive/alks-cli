#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var alks_iam_createtrustrole_1 = require("../lib/handlers/alks-iam-createtrustrole");
var roleNameDesc = 'alphanumeric including @+=._-';
var trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';
commander_1.default
    .version(package_json_1.default.version)
    .description('creates a new IAM Trust role')
    .option('-n, --rolename [rolename]', 'the name of the role, ' + roleNameDesc)
    .option('-t, --roletype [roletype]', 'the role type: Cross Account or Inner Account')
    .option('-T, --trustarn [trustarn]', 'trust arn, ' + trustArnDesc)
    .option('-e, --enableAlksAccess', 'enable alks access (MI), default: false', false)
    .option('-a, --account [alksAccount]', 'alks account to use')
    .option('-r, --role [alksRole]', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
alks_iam_createtrustrole_1.handleAlksIamCreateTrustRole(commander_1.default);
//# sourceMappingURL=alks-iam-createtrustrole.js.map