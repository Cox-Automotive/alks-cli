"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDbFileLocation = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var access = fs_1.promises.access, chmod = fs_1.promises.chmod, rename = fs_1.promises.rename;
var os_1 = require("os");
var path_1 = require("path");
var configFolder_1 = require("./configFolder");
var getDbFile_1 = require("./getDbFile");
var log_1 = require("./log");
var OLD_DB_FILE_PATH = path_1.join(os_1.homedir(), getDbFile_1.DB_FILE_NAME);
var NEW_DB_FILE_PATH = path_1.join(configFolder_1.ALKS_CONFIG_FOLDER, getDbFile_1.DB_FILE_NAME);
function updateDbFileLocation() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var oldFileExists, newFileExists, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, access(OLD_DB_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 1:
                    oldFileExists = _a.sent();
                    return [4 /*yield*/, access(NEW_DB_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 2:
                    newFileExists = _a.sent();
                    if (!(oldFileExists && !newFileExists)) return [3 /*break*/, 5];
                    log_1.log('rename ' + OLD_DB_FILE_PATH + ' to ' + NEW_DB_FILE_PATH);
                    return [4 /*yield*/, rename(OLD_DB_FILE_PATH, NEW_DB_FILE_PATH)];
                case 3:
                    _a.sent();
                    // ensure the new file has the correct permissions
                    return [4 /*yield*/, chmod(NEW_DB_FILE_PATH, 384)];
                case 4:
                    // ensure the new file has the correct permissions
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
                    log_1.log('failed to move old db file to ALKS config folder: ' + e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.updateDbFileLocation = updateDbFileLocation;
//# sourceMappingURL=updateDbFileLocation.js.map