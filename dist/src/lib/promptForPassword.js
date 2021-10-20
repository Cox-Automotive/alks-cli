"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForPassword = void 0;
var tslib_1 = require("tslib");
var getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
var getSecretFromStdin_1 = require("./getSecretFromStdin");
var password_1 = require("./state/password");
function promptForPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var answer, password;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSecretFromStdin_1.getSecretFromStdin()];
                case 1:
                    answer = _a.sent();
                    if (!!answer) return [3 /*break*/, 4];
                    return [4 /*yield*/, password_1.getPassword()];
                case 2:
                    password = _a.sent();
                    return [4 /*yield*/, getPasswordFromPrompt_1.getPasswordFromPrompt('Network Password', password)];
                case 3:
                    answer = _a.sent();
                    _a.label = 4;
                case 4:
                    password_1.cachePassword(answer);
                    return [2 /*return*/, answer];
            }
        });
    });
}
exports.promptForPassword = promptForPassword;
//# sourceMappingURL=promptForPassword.js.map