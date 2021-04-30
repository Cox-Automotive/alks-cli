"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromPrompt = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
var log_1 = require("./log");
var trim_1 = require("./trim");
var logger = 'getUserIdFromPrompt';
function getUserIdFromPrompt(text, currentUserid) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(null, logger, 'getting userid from prompt');
                    return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([
                            {
                                type: 'input',
                                name: 'userid',
                                message: text ? text : 'Network Username',
                                default: function () {
                                    return underscore_1.isEmpty(currentUserid) ? '' : currentUserid;
                                },
                                validate: function (val) {
                                    return !underscore_1.isEmpty(val)
                                        ? true
                                        : 'Please enter a value for network username.';
                                },
                            },
                        ])];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, trim_1.trim(answers.userid)];
            }
        });
    });
}
exports.getUserIdFromPrompt = getUserIdFromPrompt;
//# sourceMappingURL=getUserIdFromPrompt.js.map