"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNetrcToIni = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var access = fs_1.promises.access, rm = fs_1.promises.rm, readFile = fs_1.promises.readFile;
var path_1 = require("path");
var os_1 = require("os");
var credentials_1 = require("./state/credentials");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var log_1 = require("./log");
var credentials_2 = require("./state/credentials");
var NETRC_FILE_PATH = (0, path_1.join)((0, os_1.homedir)(), '.netrc');
var NETRC_ALKS_PASSWORD = 'alkscli';
var NETRC_ALKS_TOKEN = 'alksclitoken';
function convertNetrcToIni() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var netrcFileExists, credentialsFileExists, credentials, passwordAuth, tokenAuth, netrcData, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, log_1.log)('checking if netrc file exists');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, access(NETRC_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 2:
                    netrcFileExists = _a.sent();
                    return [4 /*yield*/, access((0, credentials_2.getCredentialsFilePath)())
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 3:
                    credentialsFileExists = _a.sent();
                    if (!(netrcFileExists && !credentialsFileExists)) return [3 /*break*/, 8];
                    (0, log_1.log)('converting netrc file to credentials file');
                    return [4 /*yield*/, (0, credentials_1.getCredentials)()];
                case 4:
                    credentials = _a.sent();
                    passwordAuth = (0, node_netrc_1.default)(NETRC_ALKS_PASSWORD);
                    if (passwordAuth.password) {
                        (0, log_1.log)('converting password auth');
                        credentials.password = passwordAuth.password;
                        // remove the alks password from the netrc file
                        node_netrc_1.default.update(NETRC_ALKS_PASSWORD);
                    }
                    tokenAuth = (0, node_netrc_1.default)(NETRC_ALKS_TOKEN);
                    if (tokenAuth.password) {
                        (0, log_1.log)('converting token auth');
                        credentials.refresh_token = tokenAuth.password;
                        // remove the alks token from the netrc file
                        node_netrc_1.default.update(NETRC_ALKS_PASSWORD);
                    }
                    (0, log_1.log)('writing credentials file');
                    return [4 /*yield*/, (0, credentials_1.setCredentials)(credentials)];
                case 5:
                    _a.sent();
                    if (!netrcFileExists) return [3 /*break*/, 8];
                    return [4 /*yield*/, readFile(NETRC_FILE_PATH, 'utf-8')];
                case 6:
                    netrcData = _a.sent();
                    if (!(netrcData.trim().length === 0)) return [3 /*break*/, 8];
                    (0, log_1.log)('removing netrc file');
                    return [4 /*yield*/, rm(NETRC_FILE_PATH)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_1 = _a.sent();
                    // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
                    (0, log_1.log)('failed to convert netrc file to ini file: ' + e_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.convertNetrcToIni = convertNetrcToIni;
//# sourceMappingURL=convertNetrcToIni.js.map