"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordFromPrompt = void 0;
const tslib_1 = require("tslib");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
const log_1 = require("./log");
const underscore_1 = require("underscore");
const trim_1 = require("./trim");
function getPasswordFromPrompt(text, currentPassword) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('getting password from prompt');
        const answers = yield (0, getStdErrPrompt_1.getStdErrPrompt)()([
            {
                type: 'password',
                name: 'password',
                message: text ? text : 'Password',
                default() {
                    return (0, underscore_1.isEmpty)(currentPassword) ? '' : currentPassword;
                },
                validate(val) {
                    return !(0, underscore_1.isEmpty)(val) ? true : 'Please enter a value.';
                },
            },
        ]);
        (0, log_1.log)(`received "${answers.password}"`, {
            unsafe: true,
            alt: `received input of ${answers.password.length} characters starting with "${answers.password.substring(0, 1)}"`,
        });
        return (0, trim_1.trim)(answers.password);
    });
}
exports.getPasswordFromPrompt = getPasswordFromPrompt;
//# sourceMappingURL=getPasswordFromPrompt.js.map