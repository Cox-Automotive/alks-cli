"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachePassword = exports.setPassword = exports.getPassword = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const underscore_1 = require("underscore");
const getCredentialsFromProcess_1 = require("../getCredentialsFromProcess");
const getEnvironmentVariableSecretWarning_1 = require("../getEnvironmentVariableSecretWarning");
const getPasswordFromKeystore_1 = require("../getPasswordFromKeystore");
const log_1 = require("../log");
const program_1 = tslib_1.__importDefault(require("../program"));
const storePassword_1 = require("../storePassword");
const PASSWORD_ENV_VAR_NAME = 'ALKS_PASSWORD';
let cachedPassword;
function getPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const passwordOption = program_1.default.opts().password;
        if (passwordOption) {
            (0, log_1.log)('using password from CLI arg');
            console.error('Warning: Passing secrets via cli options is unsafe. Please instead run `alks developer configure`, `alks-developer-login`, or set the ALKS_PASSWORD environment variable');
            return passwordOption;
        }
        const passwordFromEnv = process.env[PASSWORD_ENV_VAR_NAME];
        if (!(0, underscore_1.isEmpty)(passwordFromEnv)) {
            console.error((0, getEnvironmentVariableSecretWarning_1.getEnvironmentVariableSecretWarning)(PASSWORD_ENV_VAR_NAME));
            (0, log_1.log)('using password from environment variable');
            return passwordFromEnv;
        }
        const credentialProcessResult = yield (0, getCredentialsFromProcess_1.getCredentialsFromProcess)();
        if (credentialProcessResult.password) {
            (0, log_1.log)('using password from credential_process');
            return credentialProcessResult.password;
        }
        const passwordFromKeystore = yield (0, getPasswordFromKeystore_1.getPasswordFromKeystore)();
        if (passwordFromKeystore) {
            (0, log_1.log)('using stored password');
            return passwordFromKeystore;
        }
        if (cachedPassword) {
            (0, log_1.log)('using cached password');
            return cachedPassword;
        }
        return undefined;
    });
}
exports.getPassword = getPassword;
function setPassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, storePassword_1.storePassword)(password);
        console.error((0, cli_color_1.white)('Password saved!'));
    });
}
exports.setPassword = setPassword;
// Allows temporarily setting a password so that actions like configuring developer can work without having to save your password
function cachePassword(password) {
    cachedPassword = password;
}
exports.cachePassword = cachePassword;
//# sourceMappingURL=password.js.map