"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigFolderExists = exports.getAlksConfigFolder = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const log_1 = require("./log");
const { mkdir } = fs_1.promises;
function getAlksConfigFolder() {
    return (0, path_1.join)((0, os_1.homedir)(), '.alks-cli');
}
exports.getAlksConfigFolder = getAlksConfigFolder;
function ensureConfigFolderExists() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('ensuring config folder exists');
        // ensure the alks config folder exists
        yield mkdir(getAlksConfigFolder()).catch((err) => {
            if (err.message.includes('EEXIST')) {
                (0, log_1.log)('config folder already exists');
            }
            else {
                throw err;
            }
        });
    });
}
exports.ensureConfigFolderExists = ensureConfigFolderExists;
//# sourceMappingURL=configFolder.js.map