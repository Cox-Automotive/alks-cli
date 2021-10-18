"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordFromPrompt = void 0;
var tslib_1 = require("tslib");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
var log_1 = require("./log");
var underscore_1 = require("underscore");
var trim_1 = require("./trim");
function getPasswordFromPrompt(text, currentPassword) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('getting password from prompt');
                    return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([
                            {
                                type: 'password',
                                name: 'password',
                                message: text ? text : 'Password',
                                default: function () {
                                    return underscore_1.isEmpty(currentPassword) ? '' : currentPassword;
                                },
                                validate: function (val) {
                                    return !underscore_1.isEmpty(val) ? true : 'Please enter a value for password.';
                                },
                            },
                        ])];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, trim_1.trim(answers.password)];
            }
        });
    });
}
exports.getPasswordFromPrompt = getPasswordFromPrompt;
//# sourceMappingURL=getPasswordFromPrompt.js.map