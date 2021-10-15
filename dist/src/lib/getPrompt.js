"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrompt = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
function getPrompt(field, defaultValue, text, validator) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([
                        {
                            type: 'input',
                            name: field,
                            message: text,
                            default: function () {
                                return defaultValue;
                            },
                            validate: validator
                                ? validator
                                : function (val) {
                                    return !underscore_1.isEmpty(val)
                                        ? true
                                        : 'Please enter a value for ' + text + '.';
                                },
                        },
                    ])];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers[field]];
            }
        });
    });
}
exports.getPrompt = getPrompt;
//# sourceMappingURL=getPrompt.js.map