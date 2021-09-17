"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbFile = void 0;
var tslib_1 = require("tslib");
var promises_1 = require("fs/promises");
var getFilePathInHome_1 = require("./getFilePathInHome");
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var getOwnerReadWriteOwnerPermission_1 = require("./getOwnerReadWriteOwnerPermission");
function getDbFile() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var path, oldPath, dbFileExists, oldDbFileExists;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = getFilePathInHome_1.getFilePathInHome('.alks-cli/alks.db');
                    oldPath = getFilePathInHome_1.getFilePathInHome('alks.db');
                    dbFileExists = true;
                    return [4 /*yield*/, promises_1.access(path).catch(function () {
                            dbFileExists = false;
                        })];
                case 1:
                    _a.sent();
                    oldDbFileExists = true;
                    return [4 /*yield*/, promises_1.access(oldPath).catch(function () {
                            oldDbFileExists = false;
                        })];
                case 2:
                    _a.sent();
                    if (!(oldDbFileExists && !dbFileExists)) return [3 /*break*/, 4];
                    return [4 /*yield*/, promises_1.rename(oldPath, path)];
                case 3:
                    _a.sent();
                    dbFileExists = true;
                    oldDbFileExists = false;
                    _a.label = 4;
                case 4:
                    // if we have a db, chmod it
                    if (dbFileExists) {
                        chmod_1.default(path, getOwnerReadWriteOwnerPermission_1.getOwnerReadWriteOnlyPermission());
                    }
                    return [2 /*return*/, path];
            }
        });
    });
}
exports.getDbFile = getDbFile;
//# sourceMappingURL=getDbFile.js.map