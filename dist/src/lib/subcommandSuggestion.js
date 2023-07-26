"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcommandSuggestion = void 0;
const cli_color_1 = require("cli-color");
const fuzzy_1 = require("fuzzy");
const underscore_1 = require("underscore");
const errorAndExit_1 = require("./errorAndExit");
function subcommandSuggestion(program, subCommand) {
    const commands = (0, underscore_1.map)(program.commands, '_name');
    if (program.args.length && !(0, underscore_1.includes)(commands, subCommand)) {
        const prefix = `alks ${subCommand}`;
        const msg = [prefix, subCommand, ' is not a valid ALKS command.'];
        const suggests = (0, fuzzy_1.filter)(subCommand, commands);
        const suggest = suggests.map((sug) => sug.string);
        if (suggest.length) {
            msg.push((0, cli_color_1.white)(' Did you mean '));
            msg.push(cli_color_1.white.underline(prefix + suggest[0]));
            msg.push((0, cli_color_1.white)('?'));
        }
        (0, errorAndExit_1.errorAndExit)(msg.join(''));
    }
}
exports.subcommandSuggestion = subcommandSuggestion;
//# sourceMappingURL=subcommandSuggestion.js.map