"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deprecationWarning = void 0;
var cli_color_1 = require("cli-color");
var underscore_1 = require("underscore");
function deprecationWarning(msg) {
    msg = "\nWarning: " + (underscore_1.isEmpty(msg) ? 'This command is being deprecated.' : msg);
    console.error(cli_color_1.red.bold(msg));
}
exports.deprecationWarning = deprecationWarning;
//# sourceMappingURL=deprecationWarning.js.map