"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigFolderExists = exports.getAlksConfigFolder = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var log_1 = require("./log");
var mkdir = fs_1.promises.mkdir;
function getAlksConfigFolder() {
    return path_1.join(os_1.homedir(), '.alks-cli');
}
exports.getAlksConfigFolder = getAlksConfigFolder;
function ensureConfigFolderExists() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // ensure the alks config folder exists
                return [4 /*yield*/, mkdir(getAlksConfigFolder()).catch(function (err) {
                        if (err.message.includes('EEXIST')) {
                            log_1.log('config folder already exists');
                        }
                        else {
                            throw err;
                        }
                    })];
                case 1:
                    // ensure the alks config folder exists
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.ensureConfigFolderExists = ensureConfigFolderExists;
//# sourceMappingURL=configFolder.js.map