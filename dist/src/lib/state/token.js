"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = exports.getToken = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../log");
var getTokenFromKeystore_1 = require("../getTokenFromKeystore");
var underscore_1 = require("underscore");
var getEnvironmentVariableSecretWarning_1 = require("../getEnvironmentVariableSecretWarning");
var storeToken_1 = require("../storeToken");
var cli_color_1 = require("cli-color");
var credentials_1 = require("./credentials");
var child_process_1 = require("child_process");
var TOKEN_ENV_VAR_NAME = 'ALKS_REFRESH_TOKEN';
function getToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tokenFromEnv, credentials, output, token, tokenFromKeystore;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenFromEnv = process.env[TOKEN_ENV_VAR_NAME];
                    if (!underscore_1.isEmpty(tokenFromEnv)) {
                        console.error(getEnvironmentVariableSecretWarning_1.getEnvironmentVariableSecretWarning(TOKEN_ENV_VAR_NAME));
                        log_1.log('using refresh token from environment variable');
                        return [2 /*return*/, tokenFromEnv];
                    }
                    return [4 /*yield*/, credentials_1.getCredentials()];
                case 1:
                    credentials = _a.sent();
                    if (credentials.credential_process) {
                        output = child_process_1.spawnSync(credentials.credential_process, ['token']);
                        if (output.error) {
                            log_1.log('error encountered when executing credential process: ' + output.error);
                            throw output.error;
                        }
                        if (String(output.stderr).trim().length > 0) {
                            log_1.log('credential_process stderr: ' + output.stderr);
                        }
                        token = String(output.stdout).split('\n')[0].trim();
                        if (token.length > 0) {
                            return [2 /*return*/, token];
                        }
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