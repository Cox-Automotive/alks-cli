"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var getCallerInfo_1 = require("./getCallerInfo");
var program_1 = tslib_1.__importDefault(require("./program"));
function log(msg, opts) {
    if (opts === void 0) { opts = {}; }
    var prefix = opts.prefix;
    if (!prefix) {
        var caller = getCallerInfo_1.getCallerInfo();
        prefix = caller.fileName + ":" + caller.line + ":" + caller.char;
    }
    var verbose = opts.verbose === undefined ? program_1.default.opts().verbose : opts.verbose;
    if (verbose) {
        console.error(cli_color_1.yellow("[" + prefix + "]: " + msg));
    }
}
exports.log = log;
//# sourceMappingURL=log.js.map