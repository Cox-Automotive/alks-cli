"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForCredentialProcess = void 0;
var tslib_1 = require("tslib");
var getPrompt_1 = require("./getPrompt");
var credentialProcess_1 = require("./state/credentialProcess");
var cli_color_1 = require("cli-color");
function promptForCredentialProcess() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var credentialProcess;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, credentialProcess_1.getCredentialProcess()];
                case 1:
                    credentialProcess = _a.sent();
                    console.log(cli_color_1.white('For information on using credential_process scripts, see https://github.com/Cox-Automotive/alks-cli/wiki/Credential-Process-Scripts'));
                    return [2 /*return*/, getPrompt_1.getPrompt('scriptPath', credentialProcess, 'Path to your script', null)];
            }
        });
    });
}
exports.promptForCredentialProcess = promptForCredentialProcess;
//# sourceMappingURL=promptForCredentialProcess.js.map