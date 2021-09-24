"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbFile = exports.DB_FILE_NAME = void 0;
var tslib_1 = require("tslib");
var path_1 = require("path");
var configFolder_1 = require("./configFolder");
exports.DB_FILE_NAME = 'alks.db';
function getDbFile() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, path_1.join(configFolder_1.ALKS_CONFIG_FOLDER, exports.DB_FILE_NAME)];
        });
    });
}
exports.getDbFile = getDbFile;
//# sourceMappingURL=getDbFile.js.map