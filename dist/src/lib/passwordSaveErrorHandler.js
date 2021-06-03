"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordSaveErrorHandler = void 0;
var cli_color_1 = require("cli-color");
var isWindows_1 = require("./isWindows");
function passwordSaveErrorHandler(err) {
    console.error(cli_color_1.red('Error saving password!'), err.message);
    if (isWindows_1.isWindows()) {
        console.error(cli_color_1.red('It looks like you\'re on Windows. This is most likely a script permission error. Please run: "Set-ExecutionPolicy -Scope CurrentUser remotesigned", press "Y" and try again.'));
    }
}
exports.passwordSaveErrorHandler = passwordSaveErrorHandler;
//# sourceMappingURL=passwordSaveErrorHandler.js.map