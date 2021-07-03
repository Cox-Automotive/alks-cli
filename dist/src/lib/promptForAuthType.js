"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForAuthType = void 0;
var tslib_1 = require("tslib");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
function promptForAuthType() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var promptData, answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promptData = {
                        type: 'list',
                        name: 'authType',
                        default: 'OAuth2 Refresh Token',
                        message: 'Please choose an authentication type',
                        choices: ['OAuth2 Refresh Token', 'Username/Password (not recommended)'],
                        pageSize: 10,
                    };
                    return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([promptData])];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.authType];
            }
        });
    });
}
exports.promptForAuthType = promptForAuthType;
//# sourceMappingURL=promptForAuthType.js.map