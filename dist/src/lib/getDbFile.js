"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbFile = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var getFilePathInHome_1 = require("./getFilePathInHome");
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var getOwnerReadWriteOwnerPermission_1 = require("./getOwnerReadWriteOwnerPermission");
function getDbFile() {
    var path = process.env.ALKS_DB || getFilePathInHome_1.getFilePathInHome('alks.db');
    // if we have a db, chmod it
    if (fs_1.existsSync(path)) {
        chmod_1.default(path, getOwnerReadWriteOwnerPermission_1.getOwnerReadWriteOnlyPermission());
    }
    return path;
}
exports.getDbFile = getDbFile;
//# sourceMappingURL=getDbFile.js.map