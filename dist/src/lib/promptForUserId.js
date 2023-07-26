"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForUserId = void 0;
const tslib_1 = require("tslib");
const getPrompt_1 = require("./getPrompt");
const userId_1 = require("./state/userId");
function promptForUserId() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Ignore failure since we're about to prompt for it
        const userId = yield (0, userId_1.getUserId)();
        return (0, getPrompt_1.getPrompt)('userid', userId, 'Active Directory Username (this is not part of your email)', null);
    });
}
exports.promptForUserId = promptForUserId;
// userid.ts change getUserID prompt
// getAuth(): get auth could have returned auth or null. Then whatever calls this would handle the null response.
// Looks at alks developer configure.ts and move the get username field.
//# sourceMappingURL=promptForUserId.js.map