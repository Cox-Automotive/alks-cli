"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbFile = exports.getCustomDbFilePath = exports.getDbFileName = void 0;
var tslib_1 = require("tslib");
var path_1 = require("path");
var underscore_1 = require("underscore");
var configFolder_1 = require("./configFolder");
var log_1 = require("./log");
function getDbFileName() {
    return 'alks.db';
}
exports.getDbFileName = getDbFileName;
var DB_PATH_ENV_VAR_NAME = 'ALKS_DB';
function getCustomDbFilePath() {
    var dbPathFromEnv = process.env[DB_PATH_ENV_VAR_NAME];
    if (!(0, underscore_1.isEmpty)(dbPathFromEnv)) {
        return dbPathFromEnv;
    }
    return undefined;
}
exports.getCustomDbFilePath = getCustomDbFilePath;
function getDbFile() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var customDbFilePath;
        return tslib_1.__generator(this, function (_a) {
            customDbFilePath = getCustomDbFilePath();
            if (customDbFilePath) {
                (0, log_1.log)('using alks.db file path from environment variable');
                return [2 /*return*/, customDbFilePath];
            }
            return [2 /*return*/, (0, path_1.join)((0, configFolder_1.getAlksConfigFolder)(), getDbFileName())];
        });
    });
}
exports.getDbFile = getDbFile;
//# sourceMappingURL=getDbFile.js.map