"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = void 0;
var tslib_1 = require("tslib");
var inquirer_1 = require("inquirer");
function confirm(message, defaultAnswer) {
    if (defaultAnswer === void 0) { defaultAnswer = true; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            type: 'confirm',
                            name: 'confirmation',
                            message: message,
                            default: defaultAnswer,
                        },
                    ])];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.confirmation];
            }
        });
    });
}
exports.confirm = confirm;
//# sourceMappingURL=confirm.js.map