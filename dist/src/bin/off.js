#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var subcommandSuggestion_1 = require("../lib/subcommandSuggestion");
commander_1.default
    .version(package_json_1.default.version)
    .command('speak', 'says something')
    .action(function (o, c) {
    console.log('speak object:');
    console.log(o);
    c.version(package_json_1.default.version);
    c
        .command('german', 'sprich deutsch du hürensohn')
        .action(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log('Guten Tag');
        console.log(args);
    })
        .command('english', "you're in 'murica, speak english")
        .action(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log('Hello');
        console.log(args);
    });
})
    .parse(process.argv);
subcommandSuggestion_1.subcommandSuggestion(commander_1.default, 'test');
//# sourceMappingURL=off.js.map