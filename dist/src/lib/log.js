"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var cli_color_1 = require("cli-color");
var programCacher;
function log(program, section, msg) {
    if (program && !programCacher)
        programCacher = program; // so hacky!
    if (programCacher && programCacher.verbose) {
        console.error(cli_color_1.yellow(['[', section, ']: ', msg].join('')));
    }
}
exports.log = log;
//# sourceMappingURL=log.js.map