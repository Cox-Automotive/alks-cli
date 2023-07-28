"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin = void 0;
const tslib_1 = require("tslib");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const log_1 = require("../log");
const promptForPassword_1 = require("../promptForPassword");
const promptForUserId_1 = require("../promptForUserId");
const password_1 = require("../state/password");
const userId_1 = require("../state/userId");
function handleAlksDeveloperLogin(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (_a = options.username) !== null && _a !== void 0 ? _a : (yield (0, promptForUserId_1.promptForUserId)());
            (0, log_1.log)('saving user ID');
            yield (0, userId_1.setUserId)(userId);
            const password = yield (0, promptForPassword_1.promptForPassword)();
            (0, log_1.log)('saving password');
            yield (0, password_1.setPassword)(password);
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksDeveloperLogin = handleAlksDeveloperLogin;
//# sourceMappingURL=alks-developer-login.js.map