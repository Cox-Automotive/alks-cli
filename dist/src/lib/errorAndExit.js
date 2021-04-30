"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorAndExit = void 0;
var cli_color_1 = require("cli-color");
function errorAndExit(errorMsg, errorObj) {
    console.error(cli_color_1.red(errorMsg));
    if (errorObj) {
        console.error(cli_color_1.red(JSON.stringify(errorObj, null, 4)));
    }
    process.exit(1);
}
exports.errorAndExit = errorAndExit;
//# sourceMappingURL=errorAndExit.js.map