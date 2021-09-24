"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCredentials = exports.getCredentials = exports.getCredentialsFilePath = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var readFile = fs_1.promises.readFile, writeFile = fs_1.promises.writeFile;
var path_1 = require("path");
var ini_1 = require("ini");
var log_1 = require("../log");
var configFolder_1 = require("../configFolder");
function getCredentialsFilePath() {
    return path_1.join(configFolder_1.getAlksConfigFolder(), 'credentials');
}
exports.getCredentialsFilePath = getCredentialsFilePath;
function getCredentials() {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var credentialsFile, credentials;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, readFile(getCredentialsFilePath(), 'utf-8').catch(function () { return ''; })];
                case 1:
                    credentialsFile = _b.sent();
                    log_1.log('contents: ' + credentialsFile);
                    credentials = ini_1.parse(credentialsFile);
                    (_a = credentials.default) !== null && _a !== void 0 ? _a : (credentials.default = {});
                    return [2 /*return*/, credentials.default];
            }
        });
    });
}
exports.getCredentials = getCredentials;
function setCredentials(credentials) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var fileContents, credentialsFile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileContents = { default: credentials };
                    credentialsFile = ini_1.stringify(fileContents);
                    return [4 /*yield*/, writeFile(getCredentialsFilePath(), credentialsFile, {
                            encoding: 'utf-8',
                            mode: 384,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setCredentials = setCredentials;
//# sourceMappingURL=credentials.js.map