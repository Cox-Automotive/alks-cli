"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const getCallerInfo_1 = require("./getCallerInfo");
const program_1 = tslib_1.__importDefault(require("./program"));
function log(msg, opts = {}) {
    let prefix = opts.prefix;
    if (!prefix) {
        const caller = (0, getCallerInfo_1.getCallerInfo)();
        prefix = `${caller.fileName}:${caller.line}:${caller.char}`;
    }
    const verbose = opts.verbose === undefined
        ? program_1.default.opts().verbose || program_1.default.opts().unsafeVerbose
        : opts.verbose;
    if (opts.unsafe && !program_1.default.opts().unsafeVerbose) {
        if (opts.alt) {
            msg = opts.alt;
        }
        else {
            // Don't log anything
            return;
        }
    }
    if (verbose) {
        console.error((0, cli_color_1.yellow)(`[${prefix}]: ${msg}`));
    }
}
exports.log = log;
//# sourceMappingURL=log.js.map