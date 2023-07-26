"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewLineToEof = void 0;
const fs_1 = require("fs");
const os_1 = require("os");
const errorAndExit_1 = require("./errorAndExit");
/**
 * Adds an EOL character to the end of a file
 */
function addNewLineToEof(file) {
    try {
        (0, fs_1.appendFileSync)(file, os_1.EOL);
    }
    catch (err) {
        (0, errorAndExit_1.errorAndExit)('Error adding new line!', err);
    }
}
exports.addNewLineToEof = addNewLineToEof;
//# sourceMappingURL=addNewLineToEof.js.map