"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlksLogFolder = exports.getAlksConfigFolder = void 0;
const os_1 = require("os");
const path_1 = require("path");
function getAlksConfigFolder() {
    return (0, path_1.join)((0, os_1.homedir)(), '.alks-cli');
}
exports.getAlksConfigFolder = getAlksConfigFolder;
function getAlksLogFolder() {
    return (0, path_1.join)(getAlksConfigFolder(), 'log');
}
exports.getAlksLogFolder = getAlksLogFolder;
//# sourceMappingURL=folders.js.map