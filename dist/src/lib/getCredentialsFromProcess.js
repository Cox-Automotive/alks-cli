"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCredentialsFromProcess = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const log_1 = require("./log");
const credentialProcess_1 = require("./state/credentialProcess");
let cachedResult;
function getCredentialsFromProcess() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let result = {};
        if (cachedResult) {
            return cachedResult;
        }
        const credentialProcess = yield (0, credentialProcess_1.getCredentialProcess)();
        if (credentialProcess) {
            const output = (0, child_process_1.spawnSync)(credentialProcess);
            if (output.error) {
                (0, log_1.log)('error encountered when executing credential process: ' + output.error);
                throw output.error;
            }
            if (String(output.stderr).trim().length > 0) {
                (0, log_1.log)('credential_process stderr: ' + output.stderr);
            }
            result = JSON.parse(String(output.stdout));
        }
        else {
            (0, log_1.log)('no credential_process found');
        }
        cachedResult = result;
        return result;
    });
}
exports.getCredentialsFromProcess = getCredentialsFromProcess;
//# sourceMappingURL=getCredentialsFromProcess.js.map