"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = exports.getToken = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const underscore_1 = require("underscore");
const getCredentialsFromProcess_1 = require("../getCredentialsFromProcess");
const getEnvironmentVariableSecretWarning_1 = require("../getEnvironmentVariableSecretWarning");
const getTokenFromKeystore_1 = require("../getTokenFromKeystore");
const log_1 = require("../log");
const storeToken_1 = require("../storeToken");
const TOKEN_ENV_VAR_NAME = 'ALKS_REFRESH_TOKEN';
function getToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tokenFromEnv = process.env[TOKEN_ENV_VAR_NAME];
        if (!(0, underscore_1.isEmpty)(tokenFromEnv)) {
            console.error((0, getEnvironmentVariableSecretWarning_1.getEnvironmentVariableSecretWarning)(TOKEN_ENV_VAR_NAME));
            (0, log_1.log)('using refresh token from environment variable');
            return tokenFromEnv;
        }
        const credentialProcessResult = yield (0, getCredentialsFromProcess_1.getCredentialsFromProcess)();
        if (credentialProcessResult.refresh_token) {
            (0, log_1.log)('using token from credential_process');
            return credentialProcessResult.refresh_token;
        }
        const tokenFromKeystore = yield (0, getTokenFromKeystore_1.getTokenFromKeystore)();
        if (tokenFromKeystore) {
            (0, log_1.log)('using stored token');
            return tokenFromKeystore;
        }
        return undefined;
    });
}
exports.getToken = getToken;
function setToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, storeToken_1.storeToken)(token);
        console.error((0, cli_color_1.white)('Refresh token saved!'));
    });
}
exports.setToken = setToken;
//# sourceMappingURL=token.js.map