"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForPassword = void 0;
const tslib_1 = require("tslib");
const getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
const password_1 = require("./state/password");
function promptForPassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const password = yield (0, password_1.getPassword)();
        const answer = yield (0, getPasswordFromPrompt_1.getPasswordFromPrompt)('Network Password', password);
        (0, password_1.cachePassword)(answer);
        return answer;
    });
}
exports.promptForPassword = promptForPassword;
//# sourceMappingURL=promptForPassword.js.map