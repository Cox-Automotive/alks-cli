"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.getPassword = void 0;
var tslib_1 = require("tslib");
var program_1 = tslib_1.__importDefault(require("../program"));
var log_1 = require("../log");
var underscore_1 = require("underscore");
var savePassword_1 = require("../savePassword");
var getPasswordFromKeystore_1 = require("../getPasswordFromKeystore");
function getPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var passwordOption, passwordFromEnv, passwordFromKeystore;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    passwordOption = program_1.default.opts().password;
                    if (passwordOption) {
                        log_1.log('using password from CLI arg');
                        return [2 /*return*/, passwordOption];
                    }
                    passwordFromEnv = process.env.ALKS_PASSWORD;
                    if (!underscore_1.isEmpty(passwordFromEnv)) {
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
//# sourceMappingURL=password.js.map