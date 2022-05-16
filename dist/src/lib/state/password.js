"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachePassword = exports.setPassword = exports.getPassword = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var underscore_1 = require("underscore");
var getCredentialsFromProcess_1 = require("../getCredentialsFromProcess");
var getEnvironmentVariableSecretWarning_1 = require("../getEnvironmentVariableSecretWarning");
var getPasswordFromKeystore_1 = require("../getPasswordFromKeystore");
var log_1 = require("../log");
var program_1 = tslib_1.__importDefault(require("../program"));
var storePassword_1 = require("../storePassword");
var PASSWORD_ENV_VAR_NAME = 'ALKS_PASSWORD';
var cachedPassword;
function getPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var passwordOption, passwordFromEnv, credentialProcessResult, passwordFromKeystore;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    passwordOption = program_1.default.opts().password;
                    if (passwordOption) {
                        (0, log_1.log)('using password from CLI arg');
                        console.error('Warning: Passing secrets via cli options is unsafe. Please instead run `alks developer configure`, `alks-developer-login`, or set the ALKS_PASSWORD environment variable');
                        return [2 /*return*/, passwordOption];
                    }
                    passwordFromEnv = process.env[PASSWORD_ENV_VAR_NAME];
                    if (!(0, underscore_1.isEmpty)(passwordFromEnv)) {
                        console.error((0, getEnvironmentVariableSecretWarning_1.getEnvironmentVariableSecretWarning)(PASSWORD_ENV_VAR_NAME));
                        (0, log_1.log)('using password from environment variable');
                        return [2 /*return*/, passwordFromEnv];
                    }
                    return [4 /*yield*/, (0, getCredentialsFromProcess_1.getCredentialsFromProcess)()];
                case 1:
                    credentialProcessResult = _a.sent();
                    if (credentialProcessResult.password) {
                        (0, log_1.log)('using password from credential_process');
                        return [2 /*return*/, credentialProcessResult.password];
                    }
                    return [4 /*yield*/, (0, getPasswordFromKeystore_1.getPasswordFromKeystore)()];
                case 2:
                    passwordFromKeystore = _a.sent();
                    if (passwordFromKeystore) {
                        (0, log_1.log)('using stored password');
                        return [2 /*return*/, passwordFromKeystore];
                    }
                    if (cachedPassword) {
                        (0, log_1.log)('using cached password');
                        return [2 /*return*/, cachedPassword];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.getPassword = getPassword;
function setPassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, storePassword_1.storePassword)(password)];
                case 1:
                    _a.sent();
                    console.error((0, cli_color_1.white)('Password saved!'));
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