#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var commander_1 = tslib_1.__importDefault(require("commander"));
var fuzzy_1 = tslib_1.__importDefault(require("fuzzy"));
var utils = tslib_1.__importStar(require("../lib/utils"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
commander_1.default.command('test', 'does a test');
commander_1.default
    .command('sessions', 'manage aws sessions')
    .command('iam', 'manage iam resources')
    .command('developer', 'developer & account commands')
    .command('server', 'ec2 metadata server')
    .version(package_json_1.default.version);
if (process.stdout.isTTY) {
    console.error(cli_color_1.default.whiteBright.bold('ALKS v%s'), package_json_1.default.version);
}
commander_1.default.parse(process.argv);
var commands = underscore_1.default.map(commander_1.default.commands, '_name');
var requestedCommand = underscore_1.default.head(commander_1.default.args);
if (!commander_1.default.args.length) {
    commander_1.default.help();
}
else if (!underscore_1.default.includes(commands, requestedCommand)) {
    var msg = [requestedCommand, ' is not a valid ALKS command.'];
    var suggests = fuzzy_1.default.filter(requestedCommand, commands);
    var suggest = suggests.map(function (sug) { return sug.string; });
    if (suggest.length) {
        msg.push(cli_color_1.default.white(' Did you mean '));
        msg.push(cli_color_1.default.white.underline(suggest[0]));
        msg.push(cli_color_1.default.white('?'));
    }
    utils.errorAndExit(msg.join(''));
}
//# sourceMappingURL=alks.js.map