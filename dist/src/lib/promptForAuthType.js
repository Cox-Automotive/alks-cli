"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForAuthType = exports.ALWAYS_ASK_AUTH_CHOICE = exports.CREDENTIAL_PROCESS_AUTH_CHOICE = exports.PASSWORD_AUTH_CHOICE = exports.REFRESH_TOKEN_AUTH_CHOICE = void 0;
const tslib_1 = require("tslib");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
exports.REFRESH_TOKEN_AUTH_CHOICE = 'refresh-token';
exports.PASSWORD_AUTH_CHOICE = 'password';
exports.CREDENTIAL_PROCESS_AUTH_CHOICE = 'credential-process';
exports.ALWAYS_ASK_AUTH_CHOICE = 'always-ask';
function promptForAuthType() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const promptData = {
            type: 'list',
            name: 'authType',
            default: 'refresh-token',
            message: 'Please choose an authentication type',
            choices: [
                {
                    name: `[${exports.REFRESH_TOKEN_AUTH_CHOICE}] Store an OAuth2 refresh token`,
                    value: exports.REFRESH_TOKEN_AUTH_CHOICE,
                    short: exports.REFRESH_TOKEN_AUTH_CHOICE,
                },
                {
                    name: `[${exports.PASSWORD_AUTH_CHOICE}] Store your network password (not recommended)`,
                    value: exports.PASSWORD_AUTH_CHOICE,
                    short: exports.PASSWORD_AUTH_CHOICE,
                },
                {
                    name: `[${exports.CREDENTIAL_PROCESS_AUTH_CHOICE}] Use a custom script for gathering credentials`,
                    value: exports.CREDENTIAL_PROCESS_AUTH_CHOICE,
                    short: exports.CREDENTIAL_PROCESS_AUTH_CHOICE,
                },
                {
                    name: `[${exports.ALWAYS_ASK_AUTH_CHOICE}] Ask for your password every time`,
                    value: exports.ALWAYS_ASK_AUTH_CHOICE,
                    short: exports.ALWAYS_ASK_AUTH_CHOICE,
                },
            ],
            pageSize: 10,
        };
        const answers = yield (0, getStdErrPrompt_1.getStdErrPrompt)()([promptData]);
        return answers.authType;
    });
}
exports.promptForAuthType = promptForAuthType;
//# sourceMappingURL=promptForAuthType.js.map