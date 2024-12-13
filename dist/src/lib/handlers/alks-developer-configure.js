"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperConfigure = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const checkForUpdate_1 = require("../checkForUpdate");
const confirm_1 = require("../confirm");
const errorAndExit_1 = require("../errorAndExit");
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
const log_1 = require("../log");
const promptForOutputFormat_1 = require("../promptForOutputFormat");
const promptForPassword_1 = require("../promptForPassword");
const promptForServer_1 = require("../promptForServer");
const promptForUserId_1 = require("../promptForUserId");
const server_1 = require("../state/server");
const userId_1 = require("../state/userId");
const alksAccount_1 = require("../state/alksAccount");
const alksRole_1 = require("../state/alksRole");
const outputFormat_1 = require("../state/outputFormat");
const promptForToken_1 = require("../promptForToken");
const promptForAuthType_1 = require("../promptForAuthType");
const validateAlksAccount_1 = require("../validateAlksAccount");
const tabtab_1 = tslib_1.__importDefault(require("tabtab"));
const token_1 = require("../state/token");
const password_1 = require("../state/password");
const promptForAuthType_2 = require("../promptForAuthType");
const credentialProcess_1 = require("../state/credentialProcess");
const promptForCredentialProcess_1 = require("../promptForCredentialProcess");
function handleAlksDeveloperConfigure(options) {
    var _a, _b, _c, _d;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            if (options.nonInteractive) {
                console.log('Warning: configuring in non-interactive mode may leave the alks cli only partially configured. Running this command in interactive mode may still be needed to fully configure this tool');
            }
            const shouldPrompt = !options.nonInteractive;
            if (options.server || shouldPrompt) {
                yield (0, server_1.setServer)((_a = options.server) !== null && _a !== void 0 ? _a : (yield (0, promptForServer_1.promptForServer)()));
            }
            // Override authType flag if a credential process was provided
            let authTypeFlag = options.authType;
            if (options.credentialProcess) {
                authTypeFlag = promptForAuthType_2.CREDENTIAL_PROCESS_AUTH_CHOICE;
            }
            if (authTypeFlag || shouldPrompt) {
                const authType = authTypeFlag !== null && authTypeFlag !== void 0 ? authTypeFlag : (yield (0, promptForAuthType_1.promptForAuthType)());
                switch (authType) {
                    case promptForAuthType_1.REFRESH_TOKEN_AUTH_CHOICE: {
                        yield (0, token_1.setToken)(yield (0, promptForToken_1.promptForToken)());
                        break;
                    }
                    case promptForAuthType_1.PASSWORD_AUTH_CHOICE: {
                        if (options.username || shouldPrompt) {
                            yield (0, userId_1.setUserId)((_b = options.username) !== null && _b !== void 0 ? _b : (yield (0, promptForUserId_1.promptForUserId)()));
                        }
                        const password = yield (0, promptForPassword_1.promptForPassword)();
                        const savePasswordAnswer = yield (0, confirm_1.confirm)('Save password');
                        if (savePasswordAnswer) {
                            yield (0, password_1.setPassword)(password);
                        }
                        break;
                    }
                    case promptForAuthType_2.CREDENTIAL_PROCESS_AUTH_CHOICE: {
                        yield (0, credentialProcess_1.setCredentialProcess)((_c = options.credentialProcess) !== null && _c !== void 0 ? _c : (yield (0, promptForCredentialProcess_1.promptForCredentialProcess)()));
                        break;
                    }
                    case promptForAuthType_1.ALWAYS_ASK_AUTH_CHOICE: {
                        // do nothing
                        break;
                    }
                    default: {
                        throw new Error('Invalid auth type selected');
                    }
                }
            }
            if (options.account && options.role) {
                yield (0, validateAlksAccount_1.validateAlksAccount)(options.account, options.role);
                yield (0, alksAccount_1.setAlksAccount)(options.account);
                yield (0, alksRole_1.setAlksRole)(options.role);
            }
            else if (shouldPrompt) {
                (0, log_1.log)('Getting ALKS accounts');
                const { alksAccount, alksRole } = yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                    prompt: 'Please select your default ALKS account/role',
                });
                yield (0, alksAccount_1.setAlksAccount)(alksAccount);
                yield (0, alksRole_1.setAlksRole)(alksRole);
            }
            if (options.output || shouldPrompt) {
                (0, log_1.log)('Getting output formats');
                (0, outputFormat_1.setOutputFormat)((_d = options.output) !== null && _d !== void 0 ? _d : (yield (0, promptForOutputFormat_1.promptForOutputFormat)()));
            }
            console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
            if (process.stdin.isTTY && shouldPrompt) {
                yield tabtab_1.default.install({
                    name: 'alks',
                    completer: 'alks completion',
                });
            }
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)('Error configuring developer: ' + err.message, err);
        }
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map