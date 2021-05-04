"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForPassword = void 0;
var tslib_1 = require("tslib");
var getPasswordFromKeystore_1 = require("./getPasswordFromKeystore");
var getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
var log_1 = require("./log");
var program_1 = tslib_1.__importDefault(require("./program"));
var logger = 'promptForPassword';
function promptForPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var password;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(program_1.default, logger, 'getting existing password');
                    return [4 /*yield*/, getPasswordFromKeystore_1.getPasswordFromKeystore()];
                case 1:
                    password = _a.sent();
                    return [2 /*return*/, getPasswordFromPrompt_1.getPasswordFromPrompt('Network Password', password)];
            }
        });
    });
}
exports.promptForPassword = promptForPassword;
//# sourceMappingURL=promptForPassword.js.map