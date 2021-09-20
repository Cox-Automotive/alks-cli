"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNetrcToIni = void 0;
var tslib_1 = require("tslib");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var os_1 = require("os");
var credentials_1 = require("./state/credentials");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var log_1 = require("./log");
var NETRC_FILE_PATH = path_1.join(os_1.homedir(), '.netrc');
var NETRC_ALKS_PASSWORD = 'alkscli';
var NETRC_ALKS_TOKEN = 'alksclitoken';
function convertNetrcToIni() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var netrcFileExists, credentialsFileExists, credentials, passwordAuth, tokenAuth, netrcData, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, promises_1.access(NETRC_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 1:
                    netrcFileExists = _a.sent();
                    return [4 /*yield*/, promises_1.access(credentials_1.CREDENTIALS_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 2:
                    credentialsFileExists = _a.sent();
                    if (!(netrcFileExists && !credentialsFileExists)) return [3 /*break*/, 7];
                    return [4 /*yield*/, credentials_1.getCredentials()];
                case 3:
                    credentials = _a.sent();
                    passwordAuth = node_netrc_1.default(NETRC_ALKS_PASSWORD);
                    if (passwordAuth.password) {
                        credentials.password = passwordAuth.password;
                        // remove the alks password from the netrc file
                        node_netrc_1.default.update(NETRC_ALKS_PASSWORD);
                    }
                    tokenAuth = node_netrc_1.default(NETRC_ALKS_TOKEN);
                    if (tokenAuth.password) {
                        credentials.refresh_token = tokenAuth.password;
                        // remove the alks token from the netrc file
                        node_netrc_1.default.update(NETRC_ALKS_PASSWORD);
                    }
                    return [4 /*yield*/, credentials_1.setCredentials(credentials)];
                case 4:
                    _a.sent();
                    if (!netrcFileExists) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.readFile(NETRC_FILE_PATH, 'utf-8')];
                case 5:
                    netrcData = _a.sent();
                    if (!(netrcData.trim().length === 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.rm(NETRC_FILE_PATH)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_1 = _a.sent();
                    // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
                    log_1.log('failed to convert netrc file to ini file: ' + e_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.convertNetrcToIni = convertNetrcToIni;
//# sourceMappingURL=convertNetrcToIni.js.map