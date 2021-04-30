"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPassword = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var getPasswordFromKeystore_1 = require("./getPasswordFromKeystore");
var getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
var log_1 = require("./log");
var logger = 'password';
function getPassword(program, prompt) {
    if (prompt === void 0) { prompt = true; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var password;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(program && !underscore_1.isEmpty(program.password))) return [3 /*break*/, 1];
                    // first check password from CLI argument
                    log_1.log(program, logger, 'using password from CLI arg');
                    return [2 /*return*/, program.password];
                case 1:
                    if (!!underscore_1.isEmpty(process.env.ALKS_PASSWORD)) return [3 /*break*/, 2];
                    // then check for an environment variable
                    log_1.log(program, logger, 'using password from environment variable');
                    return [2 /*return*/, process.env.ALKS_PASSWORD];
                case 2: return [4 /*yield*/, getPasswordFromKeystore_1.getPasswordFromKeystore()];
                case 3:
                    password = _a.sent();
                    if (!underscore_1.isEmpty(password)) {
                        log_1.log(program, logger, 'using password from keystore');
                        return [2 /*return*/, password];
                    }
                    else if (prompt) {
                        // otherwise prompt the user (if we have program)
                        log_1.log(program, logger, 'no password found, prompting user');
                        return [2 /*return*/, program ? getPasswordFromPrompt_1.getPasswordFromPrompt() : null];
                    }
                    else {
                        throw new Error('No password was configured');
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPassword = getPassword;
//# sourceMappingURL=getPassword.js.map