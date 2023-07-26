"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCredentialProcess = exports.getCredentialProcess = void 0;
const tslib_1 = require("tslib");
const credentials_1 = require("./credentials");
function getCredentialProcess() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const credentials = yield (0, credentials_1.getCredentials)();
        return credentials.credential_process;
    });
}
exports.getCredentialProcess = getCredentialProcess;
function setCredentialProcess(credential_process) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const credentials = yield (0, credentials_1.getCredentials)();
        credentials.credential_process = credential_process;
        yield (0, credentials_1.setCredentials)(credentials);
    });
}
exports.setCredentialProcess = setCredentialProcess;
//# sourceMappingURL=credentialProcess.js.map