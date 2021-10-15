"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForPassword = void 0;
var tslib_1 = require("tslib");
var getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
var password_1 = require("./state/password");
function promptForPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var password, answer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, password_1.getPassword()];
                case 1:
                    password = _a.sent();
                    return [4 /*yield*/, getPasswordFromPrompt_1.getPasswordFromPrompt('Network Password', password)];
                case 2:
                    answer = _a.sent();
                    password_1.cachePassword(answer);
                    return [2 /*return*/, answer];
            }
        });
    });
}
exports.promptForPassword = promptForPassword;
//# sourceMappingURL=promptForPassword.js.map