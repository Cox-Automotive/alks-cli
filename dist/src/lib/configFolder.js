"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigFolderExists = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const log_1 = require("./log");
const folders_1 = require("./folders");
const { mkdir } = fs_1.promises;
function ensureConfigFolderExists() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('ensuring config folder exists');
        // ensure the alks config folder exists
        yield mkdir((0, folders_1.getAlksConfigFolder)()).catch((err) => {
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