"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCredentials = exports.getCredentials = exports.getCredentialsFilePath = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const { readFile, writeFile } = fs_1.promises;
const path_1 = require("path");
const ini_1 = require("ini");
const log_1 = require("../log");
const folders_1 = require("../folders");
function getCredentialsFilePath() {
    return (0, path_1.join)((0, folders_1.getAlksConfigFolder)(), 'credentials');
}
exports.getCredentialsFilePath = getCredentialsFilePath;
function getCredentials() {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const credentialsFile = yield readFile(getCredentialsFilePath(), 'utf-8').catch(() => '');
        (0, log_1.log)('contents:\n' + credentialsFile, {
            unsafe: true,
            alt: 'contents:\n' +
                credentialsFile.replace(/([^=\s\n]+)=.+\n/g, '$1=[REDACTED]\n'),
        });
        const credentials = (0, ini_1.parse)(credentialsFile);
        (_a = credentials.default) !== null && _a !== void 0 ? _a : (credentials.default = {});
        return credentials.default;
    });
}
exports.getCredentials = getCredentials;
function setCredentials(credentials) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fileContents = { default: credentials };
        const credentialsFile = (0, ini_1.stringify)(fileContents);
        yield writeFile(getCredentialsFilePath(), credentialsFile, {
            encoding: 'utf-8',
            mode: 0o600,
        });
    });
}
exports.setCredentials = setCredentials;
//# sourceMappingURL=credentials.js.map