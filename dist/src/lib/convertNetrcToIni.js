"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNetrcToIni = void 0;
var tslib_1 = require("tslib");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var os_1 = require("os");
var credentials_1 = require("./state/credentials");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var NETRC_FILE_PATH = path_1.join(os_1.homedir(), '.netrc');
var ALKS_USERID = 'alksuid';
var ALKS_TOKEN = 'alksclitoken';
function convertNetrcToIni() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var netrcFileExists, credentialsFileExists, credentials, passwordAuth, tokenAuth;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.access(NETRC_FILE_PATH)
                        .then(function () { return true; })
                        .catch(function () { return false; })];
                case 1:
                    netrcFileExists = _a.sent();
                    return [4 /*yield*/, promises_1.access(credentials_1.CREDENTIALS_FILE_PATH)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 2:
                    credentialsFileExists = _a.sent();
                    if (!(netrcFileExists && !credentialsFileExists)) return [3 /*break*/, 5];
                    return [4 /*yield*/, credentials_1.getCredentials()];
                case 3:
                    credentials = _a.sent();
                    passwordAuth = node_netrc_1.default(ALKS_USERID);
                    if (passwordAuth.password) {
                        credentials.password = passwordAuth.password;
                    }
                    tokenAuth = node_netrc_1.default(ALKS_TOKEN);
                    if (tokenAuth.password) {
                        credentials.token = tokenAuth.password;
                    }
                    return [4 /*yield*/, credentials_1.setCredentials(credentials)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!netrcFileExists) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.rm(NETRC_FILE_PATH)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.convertNetrcToIni = convertNetrcToIni;
//# sourceMappingURL=convertNetrcToIni.js.map