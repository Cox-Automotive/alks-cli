"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForCredentialProcess = void 0;
const tslib_1 = require("tslib");
const getPrompt_1 = require("./getPrompt");
const credentialProcess_1 = require("./state/credentialProcess");
const cli_color_1 = require("cli-color");
function promptForCredentialProcess() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const credentialProcess = yield (0, credentialProcess_1.getCredentialProcess)();
        console.log((0, cli_color_1.white)('For information on using credential_process scripts, see https://github.com/Cox-Automotive/alks-cli/wiki/Credential-Process-Scripts'));
        return (0, getPrompt_1.getPrompt)('scriptPath', credentialProcess, 'Path to your script', null);
    });
}
exports.promptForCredentialProcess = promptForCredentialProcess;
//# sourceMappingURL=promptForCredentialProcess.js.map