"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorAndExit = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var program_1 = tslib_1.__importDefault(require("./program"));
/**
 * Print an error and exit.
 *
 * If -v is passed, the error is printed, otherwise just the message.
 *
 * @example
 * errorAndExit('test'); // If no error is given it creates one
 *
 * @example
 * errorAndExit('test', new Error());
 *
 * @example
 * errorAndExit(new Error()); // If no message is given it uses the error's message
 *
 * @example
 * errorAndExit(new Error(), new Error()) // ignores the second error, only uses the first
 */
function errorAndExit(message, error) {
    if (typeof message !== 'string') {
        error = message;
        message = error.message;
    }
    if (!error) {
        error = new Error(message);
    }
    if (program_1.default.opts().verbose) {
        console.error(cli_color_1.red(error.stack));
    }
    else {
        console.error(cli_color_1.red(message));
    }
    process.exit(1);
}
exports.errorAndExit = errorAndExit;
//# sourceMappingURL=errorAndExit.js.map