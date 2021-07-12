"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachePassword = exports.setPassword = exports.getPassword = void 0;
var tslib_1 = require("tslib");
var program_1 = tslib_1.__importDefault(require("../program"));
var log_1 = require("../log");
var underscore_1 = require("underscore");
var savePassword_1 = require("../savePassword");
var getPasswordFromKeystore_1 = require("../getPasswordFromKeystore");
var getEnvironmentVariableSecretWarning_1 = require("../getEnvironmentVariableSecretWarning");
var PASSWORD_ENV_VAR_NAME = 'ALKS_PASSWORD';
var cachedPassword;
function getPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var passwordOption, passwordFromEnv, passwordFromKeystore;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    passwordOption = program_1.default.opts().password;
                    if (passwordOption) {
                        log_1.log('using password from CLI arg');
                        console.error('Warning: Passing secrets via cli options is unsafe. Please instead run `alks developer configure`, `alks-developer-login`, or set the ALKS_PASSWORD environment variable');
                        return [2 /*return*/, passwordOption];
                    }
                    passwordFromEnv = process.env[PASSWORD_ENV_VAR_NAME];
                    if (!underscore_1.isEmpty(passwordFromEnv)) {
                        console.error(getEnvironmentVariableSecretWarning_1.getEnvironmentVariableSecretWarning(PASSWORD_ENV_VAR_NAME));
                        log_1.log('using password from environment variable');
                        return [2 /*return*/, passwordFromEnv];
                    }
                    return [4 /*yield*/, getPasswordFromKeystore_1.getPasswordFromKeystore()];
                case 1:
                    passwordFromKeystore = _a.sent();
                    if (passwordFromKeystore) {
                        log_1.log('using stored password');
                        return [2 /*return*/, passwordFromKeystore];
                    }
                    if (cachedPassword) {
                        log_1.log('using cached password');
                        return [2 /*return*/, cachedPassword];
                    }
                    throw new Error('No password was configured');
            }
        });
    });
}
exports.getPassword = getPassword;
function setPassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, savePassword_1.savePassword(password)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setPassword = setPassword;
// Allows temporarily setting a password so that actions like configuring developer can work without having to save your password
function cachePassword(password) {
    cachedPassword = password;
}
exports.cachePassword = cachePassword;
//# sourceMappingURL=password.js.map