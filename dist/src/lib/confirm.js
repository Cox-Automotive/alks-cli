"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = require("inquirer");
function confirm(message, defaultAnswer = true) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const answers = yield (0, inquirer_1.prompt)([
            {
                type: 'confirm',
                name: 'confirmation',
                message,
                default: defaultAnswer,
            },
        ]);
        return answers.confirmation;
    });
}
exports.confirm = confirm;
//# sourceMappingURL=confirm.js.map