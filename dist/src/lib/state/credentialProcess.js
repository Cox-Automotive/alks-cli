"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCredentialProcess = exports.getCredentialProcess = void 0;
var tslib_1 = require("tslib");
var credentials_1 = require("./credentials");
function getCredentialProcess() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var credentials;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, credentials_1.getCredentials()];
                case 1:
                    credentials = _a.sent();
                    return [2 /*return*/, credentials.credential_process];
            }
        });
    });
}
exports.getCredentialProcess = getCredentialProcess;
function setCredentialProcess(credential_process) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var credentials;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, credentials_1.getCredentials()];
                case 1:
                    credentials = _a.sent();
                    credentials.credential_process = credential_process;
                    return [4 /*yield*/, credentials_1.setCredentials(credentials)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setCredentialProcess = setCredentialProcess;
//# sourceMappingURL=credentialProcess.js.map