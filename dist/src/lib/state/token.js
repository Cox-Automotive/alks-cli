"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = exports.getToken = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../log");
var saveToken_1 = require("../saveToken");
var getTokenFromKeystore_1 = require("../getTokenFromKeystore");
var underscore_1 = require("underscore");
var getEnvironmentVariableSecretWarning_1 = require("../getEnvironmentVariableSecretWarning");
var TOKEN_ENV_VAR_NAME = 'ALKS_REFRESH_TOKEN';
function getToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tokenFromEnv, tokenFromKeystore;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenFromEnv = process.env[TOKEN_ENV_VAR_NAME];
                    if (!underscore_1.isEmpty(tokenFromEnv)) {
                        console.error(getEnvironmentVariableSecretWarning_1.getEnvironmentVariableSecretWarning(TOKEN_ENV_VAR_NAME));
                        log_1.log('using refresh token from environment variable');
                        return [2 /*return*/, tokenFromEnv];
                    }
                    return [4 /*yield*/, getTokenFromKeystore_1.getTokenFromKeystore()];
                case 1:
                    tokenFromKeystore = _a.sent();
                    if (tokenFromKeystore) {
                        log_1.log('using stored token');
                        return [2 /*return*/, tokenFromKeystore];
                    }
                    throw new Error('No token was configured');
            }
        });
    });
}
exports.getToken = getToken;
function setToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, saveToken_1.saveToken(token)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setToken = setToken;
//# sourceMappingURL=token.js.map