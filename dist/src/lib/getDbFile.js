"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbFile = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var getFilePathInHome_1 = require("./getFilePathInHome");
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var getOwnerReadWriteOwnerPermission_1 = require("./getOwnerReadWriteOwnerPermission");
function getDbFile() {
    // Handle migrating from the old path to the new path
    var path = getFilePathInHome_1.getFilePathInHome('.alks-cli/alks.db');
    var oldPath = getFilePathInHome_1.getFilePathInHome('alks.db');
    var dbFileExists = true;
    try {
        fs_1.accessSync(path);
    }
    catch (_a) {
        dbFileExists = false;
    }
    var oldDbFileExists = true;
    try {
        fs_1.accessSync(oldPath);
    }
    catch (_b) {
        oldDbFileExists = false;
    }
    if (oldDbFileExists && !dbFileExists) {
        fs_1.renameSync(oldPath, path);
        dbFileExists = true;
        oldDbFileExists = false;
    }
    // if we have a db, chmod it
    if (dbFileExists) {
        chmod_1.default(path, getOwnerReadWriteOwnerPermission_1.getOwnerReadWriteOnlyPermission());
    }
    return path;
}
exports.getDbFile = getDbFile;
//# sourceMappingURL=getDbFile.js.map