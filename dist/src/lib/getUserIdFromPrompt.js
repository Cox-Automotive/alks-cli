"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromPrompt = void 0;
const tslib_1 = require("tslib");
const underscore_1 = require("underscore");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
const log_1 = require("./log");
const trim_1 = require("./trim");
function getUserIdFromPrompt(text, currentUserid) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('getting userid from prompt');
        const answers = yield (0, getStdErrPrompt_1.getStdErrPrompt)()([
            {
                type: 'input',
                name: 'userid',
                message: text ? text : 'Network Username',
                default() {
                    return (0, underscore_1.isEmpty)(currentUserid) ? '' : currentUserid;
                },
                validate(val) {
                    return !(0, underscore_1.isEmpty)(val)
                        ? true
                        : 'Please enter a value for network username.';
                },
            },
        ]);
        return (0, trim_1.trim)(answers.userid);
    });
}
exports.getUserIdFromPrompt = getUserIdFromPrompt;
//# sourceMappingURL=getUserIdFromPrompt.js.map