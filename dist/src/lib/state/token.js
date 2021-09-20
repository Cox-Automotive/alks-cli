"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = exports.getToken = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var underscore_1 = require("underscore");
var getCredentialsFromProcess_1 = require("../getCredentialsFromProcess");
var getEnvironmentVariableSecretWarning_1 = require("../getEnvironmentVariableSecretWarning");
var getTokenFromKeystore_1 = require("../getTokenFromKeystore");
var log_1 = require("../log");
var storeToken_1 = require("../storeToken");
var TOKEN_ENV_VAR_NAME = 'ALKS_REFRESH_TOKEN';
function getToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tokenFromEnv, credentialProcessResult, tokenFromKeystore;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenFromEnv = process.env[TOKEN_ENV_VAR_NAME];
                    if (!underscore_1.isEmpty(tokenFromEnv)) {
                        console.error(getEnvironmentVariableSecretWarning_1.getEnvironmentVariableSecretWarning(TOKEN_ENV_VAR_NAME));
                        log_1.log('using refresh token from environment variable');
                        return [2 /*return*/, tokenFromEnv];
                    }
                    return [4 /*yield*/, getCredentialsFromProcess_1.getCredentialsFromProcess()];
                case 1:
                    credentialProcessResult = _a.sent();
                    if (credentialProcessResult.refresh_token) {
                        log_1.log('using token from credential_process');
                        return [2 /*return*/, credentialProcessResult.refresh_token];
                    }
                    return [4 /*yield*/, getTokenFromKeystore_1.getTokenFromKeystore()];
                case 2:
                    tokenFromKeystore = _a.sent();
                    if (tokenFromKeystore) {
                        log_1.log('using stored token');
                        return [2 /*return*/, tokenFromKeystore];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.getToken = getToken;
function setToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storeToken_1.storeToken(token)];
                case 1:
                    _a.sent();
                    console.error(cli_color_1.white('Refresh token saved!'));
                    return [2 /*return*/];
            }
        });
    });
}
exports.setToken = setToken;
//# sourceMappingURL=token.js.map