"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin2fa = void 0;
const tslib_1 = require("tslib");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const promptForToken_1 = require("../promptForToken");
const token_1 = require("../state/token");
function handleAlksDeveloperLogin2fa(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, token_1.setToken)(yield (0, promptForToken_1.promptForToken)());
            yield (0, checkForUpdate_1.checkForUpdate)();
            setTimeout(() => {
                process.exit(0);
            }, 1000); // needed for if browser is still open
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksDeveloperLogin2fa = handleAlksDeveloperLogin2fa;
//# sourceMappingURL=alks-developer-login2fa.js.map