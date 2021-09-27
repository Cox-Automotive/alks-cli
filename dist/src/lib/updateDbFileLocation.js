"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDbFileLocation = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var access = fs_1.promises.access, chmod = fs_1.promises.chmod, rename = fs_1.promises.rename;
var os_1 = require("os");
var path_1 = require("path");
var log_1 = require("./log");
var getDbFile_1 = require("./getDbFile");
var configFolder_1 = require("./configFolder");
var OLD_DB_FILE_PATH = path_1.join(os_1.homedir(), getDbFile_1.getDbFileName());
var NEW_DB_FILE_PATH = path_1.join(configFolder_1.getAlksConfigFolder(), getDbFile_1.getDbFileName());
function updateDbFileLocation() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var customDbFilePath, oldFileExists, newFileExists, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    customDbFilePath = getDbFile_1.getCustomDbFilePath();
                    if (!customDbFilePath) return [3 /*break*/, 1];
                    // Don't attempt to migrate if they're using a custom db file path
                    log_1.log("Custom db file path detected so no migration is attempted. Using DB file at " + customDbFilePath);
                    return [2 /*return*/];
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, access(OLD_DB_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 2:
                    oldFileExists = _a.sent();
                    return [4 /*yield*/, access(NEW_DB_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 3:
                    newFileExists = _a.sent();
                    if (!(oldFileExists && !newFileExists)) return [3 /*break*/, 6];
                    log_1.log('rename ' + OLD_DB_FILE_PATH + ' to ' + NEW_DB_FILE_PATH);
                    return [4 /*yield*/, rename(OLD_DB_FILE_PATH, NEW_DB_FILE_PATH)];
                case 4:
                    _a.sent();
                    // ensure the new file has the correct permissions
                    return [4 /*yield*/, chmod(NEW_DB_FILE_PATH, 384)];
                case 5:
                    // ensure the new file has the correct permissions
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_1 = _a.sent();
                    // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
                    log_1.log('failed to move old db file to ALKS config folder: ' + e_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.updateDbFileLocation = updateDbFileLocation;
//# sourceMappingURL=updateDbFileLocation.js.map