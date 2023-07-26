"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrompt = void 0;
const tslib_1 = require("tslib");
const underscore_1 = require("underscore");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
function getPrompt(field, defaultValue, text, validator) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const answers = yield (0, getStdErrPrompt_1.getStdErrPrompt)()([
            {
                type: 'input',
                name: field,
                message: text,
                default: () => {
                    return defaultValue;
                },
                validate: validator
                    ? validator
                    : (val) => {
                        return !(0, underscore_1.isEmpty)(val)
                            ? true
                            : 'Please enter a value for ' + text + '.';
                    },
            },
        ]);
        return answers[field];
    });
}
exports.getPrompt = getPrompt;
//# sourceMappingURL=getPrompt.js.map