"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlks = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var errorAndExit_1 = require("../errorAndExit");
var package_json_1 = tslib_1.__importDefault(require("../../../package.json"));
var fuzzy_1 = tslib_1.__importDefault(require("fuzzy"));
function handleAlks(program) {
    if (process.stdout.isTTY) {
        console.error(cli_color_1.default.whiteBright.bold('ALKS v%s'), package_json_1.default.version);
    }
    console.log(program.commands);
    var commands = underscore_1.map(program.commands, '_name');
    console.log(commands);
    var requestedCommand = underscore_1.head(program.args);
    if (!program.args.length) {
        program.help();
    }
    else if (!underscore_1.includes(commands, requestedCommand)) {
        var msg = [requestedCommand, ' is not a valid ALKS command.'];
        var suggests = fuzzy_1.default.filter(requestedCommand, commands);
        var suggest = suggests.map(function (sug) { return sug.string; });
        if (suggest.length) {
            msg.push(cli_color_1.default.white(' Did you mean '));
            msg.push(cli_color_1.default.white.underline(suggest[0]));
            msg.push(cli_color_1.default.white('?'));
        }
        errorAndExit_1.errorAndExit(msg.join(''));
    }
}
exports.handleAlks = handleAlks;
//# sourceMappingURL=alks.js.map