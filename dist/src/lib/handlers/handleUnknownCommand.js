"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnknownCommand = void 0;
const tslib_1 = require("tslib");
const fuzzy_1 = tslib_1.__importDefault(require("fuzzy"));
const errorAndExit_1 = require("../errorAndExit");
const cli_color_1 = require("cli-color");
const getLastMatchingProgram_1 = require("../getLastMatchingProgram");
function handleUnknownCommand(program) {
    if (!program.args.length) {
        (0, errorAndExit_1.errorAndExit)('handleUnknownCommand was called but there are no arguments to process');
    }
    const command = (0, getLastMatchingProgram_1.getLastMatchingProgram)(program);
    const commandNames = command.commands.map((c) => c.name());
    const prefixArgs = [];
    const args = ['alks', ...program.args];
    let arg;
    while ((arg = args.shift())) {
        prefixArgs.push(arg);
        if (arg == command.name()) {
            break;
        }
    }
    const unknownCommand = args.shift();
    const prefix = prefixArgs.join(' ');
    const msg = [unknownCommand, ' is not a valid ALKS command.'];
    const suggests = fuzzy_1.default.filter(unknownCommand, commandNames);
    const suggest = suggests.map((sug) => sug.string);
    if (suggest.length) {
        msg.push((0, cli_color_1.white)(' Did you mean '));
        msg.push(cli_color_1.white.underline(prefix + ' ' + suggest[0]));
        msg.push((0, cli_color_1.white)('?'));
    }
    (0, errorAndExit_1.errorAndExit)(msg.join(''));
}
exports.handleUnknownCommand = handleUnknownCommand;
//# sourceMappingURL=handleUnknownCommand.js.map