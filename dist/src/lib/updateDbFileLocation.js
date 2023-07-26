"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDbFileLocation = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const { access, chmod, rename } = fs_1.promises;
const os_1 = require("os");
const path_1 = require("path");
const log_1 = require("./log");
const getDbFile_1 = require("./getDbFile");
const configFolder_1 = require("./configFolder");
const OLD_DB_FILE_PATH = (0, path_1.join)((0, os_1.homedir)(), (0, getDbFile_1.getDbFileName)());
const NEW_DB_FILE_PATH = (0, path_1.join)((0, configFolder_1.getAlksConfigFolder)(), (0, getDbFile_1.getDbFileName)());
function updateDbFileLocation() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const customDbFilePath = (0, getDbFile_1.getCustomDbFilePath)();
        if (customDbFilePath) {
            // Don't attempt to migrate if they're using a custom db file path
            (0, log_1.log)(`Custom db file path detected so no migration is attempted. Using DB file at ${customDbFilePath}`);
            return;
        }
        else {
            try {
                const oldFileExists = yield access(OLD_DB_FILE_PATH)
                    .then(() => true)
                    .catch(() => false);
                const newFileExists = yield access(NEW_DB_FILE_PATH)
                    .then(() => true)
                    .catch(() => false);
                // If new file hasn't been created yet but the old file exists, move the old file to the new location
                if (oldFileExists && !newFileExists) {
                    (0, log_1.log)('rename ' + OLD_DB_FILE_PATH + ' to ' + NEW_DB_FILE_PATH);
                    yield rename(OLD_DB_FILE_PATH, NEW_DB_FILE_PATH);
                    // ensure the new file has the correct permissions
                    yield chmod(NEW_DB_FILE_PATH, 0o600);
                }
            }
            catch (e) {
                // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
                (0, log_1.log)('failed to move old db file to ALKS config folder: ' + e);
            }
        }
    });
}
exports.updateDbFileLocation = updateDbFileLocation;
//# sourceMappingURL=updateDbFileLocation.js.map