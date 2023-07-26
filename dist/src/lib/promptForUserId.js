"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForUserId = void 0;
var tslib_1 = require("tslib");
var getPrompt_1 = require("./getPrompt");
var userId_1 = require("./state/userId");
function promptForUserId() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var userId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, userId_1.getUserId)()];
                case 1:
                    userId = _a.sent();
                    return [2 /*return*/, (0, getPrompt_1.getPrompt)('userid', userId, 'Active Directory Username (this is not part of your email)', null)];
            }
        });
    });
}
exports.promptForUserId = promptForUserId;
// userid.ts change getUserID prompt
// getAuth(): get auth could have returned auth or null. Then whatever calls this would handle the null response.
// Looks at alks developer configure.ts and move the get username field.
//# sourceMappingURL=promptForUserId.js.map