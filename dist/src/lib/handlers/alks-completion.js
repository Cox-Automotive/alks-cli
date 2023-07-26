"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCompletion = void 0;
const tslib_1 = require("tslib");
const tabtab_1 = tslib_1.__importDefault(require("tabtab"));
const program_1 = tslib_1.__importDefault(require("../program"));
function handleCompletion(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const env = tabtab_1.default.parseEnv(process.env);
        const suggestions = [];
        suggestions.push('-v', '--verbose');
        const commands = program_1.default.commands;
        if (env.prev === 'alks') {
            // complete top-level commands
            suggestions.push(...commands.map((c) => c.name()));
        }
        else {
            for (const command of commands) {
                const subcommands = command.commands;
                if (env.prev === command.name()) {
                    // complete subcommands
                    suggestions.push(...subcommands.map((c) => c.name()));
                }
                else {
                    for (const subcommand of subcommands) {
                        // Use regex to ensure subcommand is surrounded by spaces (ie. don't match "session" against "sessions")
                        const subcommandRegex = new RegExp(`\\s${subcommand.name()}\\s`);
                        if (subcommandRegex.test(env.line)) {
                            // tabtab doesn't include this in their typings but the field does exist
                            const rawOptions = subcommand.options;
                            const options = Object.values(rawOptions
                                .flatMap((o) => [o.short, o.long])
                                .filter((o) => !!o));
                            // complete the flags/options for subcommands
                            suggestions.push(...options);
                        }
                    }
                }
            }
        }
        tabtab_1.default.log(suggestions);
    });
}
exports.handleCompletion = handleCompletion;
//# sourceMappingURL=alks-completion.js.map