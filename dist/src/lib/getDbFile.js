"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbFile = exports.getCustomDbFilePath = exports.getDbFileName = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const underscore_1 = require("underscore");
const folders_1 = require("./folders");
const log_1 = require("./log");
function getDbFileName() {
    return 'alks.db';
}
exports.getDbFileName = getDbFileName;
const DB_PATH_ENV_VAR_NAME = 'ALKS_DB';
function getCustomDbFilePath() {
    const dbPathFromEnv = process.env[DB_PATH_ENV_VAR_NAME];
    if (!(0, underscore_1.isEmpty)(dbPathFromEnv)) {
        return dbPathFromEnv;
    }
    return undefined;
}
exports.getCustomDbFilePath = getCustomDbFilePath;
function getDbFile() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const customDbFilePath = getCustomDbFilePath();
        if (customDbFilePath) {
            (0, log_1.log)('using alks.db file path from environment variable');
            return customDbFilePath;
        }
        return (0, path_1.join)((0, folders_1.getAlksConfigFolder)(), getDbFileName());
    });
}
exports.getDbFile = getDbFile;
//# sourceMappingURL=getDbFile.js.map