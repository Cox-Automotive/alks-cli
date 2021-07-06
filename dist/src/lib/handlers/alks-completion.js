"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCompletion = void 0;
var tslib_1 = require("tslib");
var tabtab_1 = tslib_1.__importDefault(require("tabtab"));
var program_1 = tslib_1.__importDefault(require("../program"));
function handleCompletion(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var env, suggestions, commands, _i, commands_1, command, subcommands, _a, subcommands_1, subcommand, subcommandRegex, rawOptions, options;
        return tslib_1.__generator(this, function (_b) {
            env = tabtab_1.default.parseEnv(process.env);
            suggestions = [];
            suggestions.push('-v', '--verbose');
            commands = program_1.default.commands;
            if (env.prev === 'alks') {
                // complete top-level commands
                suggestions.push.apply(suggestions, commands.map(function (c) { return c.name(); }));
            }
            else {
                for (_i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                    command = commands_1[_i];
                    subcommands = command.commands;
                    if (env.prev === command.name()) {
                        // complete subcommands
                        suggestions.push.apply(suggestions, subcommands.map(function (c) { return c.name(); }));
                    }
                    else {
                        for (_a = 0, subcommands_1 = subcommands; _a < subcommands_1.length; _a++) {
                            subcommand = subcommands_1[_a];
                            subcommandRegex = new RegExp("\\s" + subcommand.name() + "\\s");
                            if (subcommandRegex.test(env.line)) {
                                rawOptions = subcommand.options;
                                options = Object.values(rawOptions
                                    .flatMap(function (o) { return [o.short, o.long]; })
                                    .filter(function (o) { return !!o; }));
                                // complete the flags/options for subcommands
                                suggestions.push.apply(suggestions, options);
                            }
                        }
                    }
                }
            }
            tabtab_1.default.log(suggestions);
            return [2 /*return*/];
        });
    });
}
exports.handleCompletion = handleCompletion;
//# sourceMappingURL=alks-completion.js.map