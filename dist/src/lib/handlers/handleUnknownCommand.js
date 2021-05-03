"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnknownCommand = void 0;
var tslib_1 = require("tslib");
var fuzzy_1 = tslib_1.__importDefault(require("fuzzy"));
var errorAndExit_1 = require("../errorAndExit");
var cli_color_1 = require("cli-color");
var getLastMatchingProgram_1 = require("../getLastMatchingProgram");
function handleUnknownCommand(program) {
    if (!program.args.length) {
        errorAndExit_1.errorAndExit('handleUnknownCommand was called but there are no arguments to process');
    }
    var command = getLastMatchingProgram_1.getLastMatchingProgram(program);
    var commandNames = command.commands.map(function (c) { return c.name(); });
    var prefixArgs = [];
    var args = tslib_1.__spreadArray(['alks'], program.args);
    var arg;
    while (arg = args.shift()) {
        prefixArgs.push(arg);
        if (arg == command.name()) {
            break;
        }
    }
    var unknownCommand = args.shift();
    var prefix = prefixArgs.join(' ');
    var msg = [unknownCommand, ' is not a valid ALKS command.'];
    var suggests = fuzzy_1.default.filter(unknownCommand, commandNames);
    var suggest = suggests.map(function (sug) { return sug.string; });
    if (suggest.length) {
        msg.push(cli_color_1.white(' Did you mean '));
        msg.push(cli_color_1.white.underline(prefix + ' ' + suggest[0]));
        msg.push(cli_color_1.white('?'));
    }
    errorAndExit_1.errorAndExit(msg.join(''));
}
exports.handleUnknownCommand = handleUnknownCommand;
//# sourceMappingURL=handleUnknownCommand.js.map