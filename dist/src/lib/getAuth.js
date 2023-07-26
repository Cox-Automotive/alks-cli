"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = void 0;
const tslib_1 = require("tslib");
const log_1 = require("../lib/log");
const promptForPassword_1 = require("./promptForPassword");
const password_1 = require("./state/password");
const token_1 = require("./state/token");
const userId_1 = require("./state/userId");
function getAuth() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('checking for refresh token');
        const token = yield (0, token_1.getToken)();
        if (token) {
            const auth = { token };
            return auth;
        }
        else {
            (0, log_1.log)('no refresh token found, falling back to password');
            const userid = yield (0, userId_1.getUserId)();
            if (!userid) {
                throw new Error('No userid was configured');
            }
            // If password is not set, ask for a password
            const password = (yield (0, password_1.getPassword)()) || (yield (0, promptForPassword_1.promptForPassword)());
            const auth = { userid, password };
            return auth;
        }
    });
}
exports.getAuth = getAuth;
//# sourceMappingURL=getAuth.js.map