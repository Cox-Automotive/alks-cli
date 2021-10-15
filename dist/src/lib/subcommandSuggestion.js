"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcommandSuggestion = void 0;
var cli_color_1 = require("cli-color");
var fuzzy_1 = require("fuzzy");
var underscore_1 = require("underscore");
var errorAndExit_1 = require("./errorAndExit");
function subcommandSuggestion(program, subCommand) {
    var commands = underscore_1.map(program.commands, '_name');
    if (program.args.length && !underscore_1.includes(commands, subCommand)) {
        var prefix = "alks " + subCommand;
        var msg = [prefix, subCommand, ' is not a valid ALKS command.'];
        var suggests = fuzzy_1.filter(subCommand, commands);
        var suggest = suggests.map(function (sug) { return sug.string; });
        if (suggest.length) {
            msg.push(cli_color_1.white(' Did you mean '));
            msg.push(cli_color_1.white.underline(prefix + suggest[0]));
            msg.push(cli_color_1.white('?'));
        }
        errorAndExit_1.errorAndExit(msg.join(''));
    }
}
exports.subcommandSuggestion = subcommandSuggestion;
//# sourceMappingURL=subcommandSuggestion.js.map