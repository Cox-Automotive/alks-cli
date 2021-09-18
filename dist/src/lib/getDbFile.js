"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbFile = exports.DB_FILE_NAME = void 0;
var tslib_1 = require("tslib");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var getFilePathInHome_1 = require("./getFilePathInHome");
var log_1 = require("./log");
var credentials_1 = require("./state/credentials");
exports.DB_FILE_NAME = 'alks.db';
function getDbFile() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var path, oldPath, dbFileExists, oldDbFileExists;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = path_1.join(credentials_1.ALKS_CONFIG_FOLDER, exports.DB_FILE_NAME);
                    oldPath = getFilePathInHome_1.getFilePathInHome('alks.db');
                    dbFileExists = true;
                    return [4 /*yield*/, promises_1.access(path).catch(function () {
                            log_1.log('no access to ' + path);
                            dbFileExists = false;
                        })];
                case 1:
                    _a.sent();
                    oldDbFileExists = true;
                    return [4 /*yield*/, promises_1.access(oldPath).catch(function () {
                            log_1.log('no access to ' + oldPath);
                            oldDbFileExists = false;
                        })];
                case 2:
                    _a.sent();
                    if (!(oldDbFileExists && !dbFileExists)) return [3 /*break*/, 4];
                    log_1.log('rename ' + oldPath + ' to ' + path);
                    return [4 /*yield*/, promises_1.rename(oldPath, path)];
                case 3:
                    _a.sent();
                    dbFileExists = true;
                    oldDbFileExists = false;
                    _a.label = 4;
                case 4:
                    if (!dbFileExists) return [3 /*break*/, 6];
                    return [4 /*yield*/, promises_1.chmod(path, 384)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6:
                    log_1.log('db file not found. A new db file will be created');
                    // Ensure the folder exists
                    return [4 /*yield*/, promises_1.mkdir(credentials_1.ALKS_CONFIG_FOLDER).catch(function () { })];
                case 7:
                    // Ensure the folder exists
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, path];
            }
        });
    });
}
exports.getDbFile = getDbFile;
//# sourceMappingURL=getDbFile.js.map