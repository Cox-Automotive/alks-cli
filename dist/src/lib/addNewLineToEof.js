"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewLineToEof = void 0;
var fs_1 = require("fs");
var os_1 = require("os");
var errorAndExit_1 = require("./errorAndExit");
/**
 * Adds an EOL character to the end of a file
 */
function addNewLineToEof(file) {
    try {
        fs_1.appendFileSync(file, os_1.EOL);
    }
    catch (err) {
        errorAndExit_1.errorAndExit('Error adding new line!', err);
    }
}
exports.addNewLineToEof = addNewLineToEof;
//# sourceMappingURL=addNewLineToEof.js.map