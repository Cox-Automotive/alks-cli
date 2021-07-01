"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForOutputFormat = void 0;
var tslib_1 = require("tslib");
var getOutputValues_1 = require("./getOutputValues");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
var outputFormat_1 = require("./state/outputFormat");
function promptForOutputFormat() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var outputFormat, promptData, answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, outputFormat_1.getOutputFormat().catch(function () { return undefined; })];
                case 1:
                    outputFormat = _a.sent();
                    promptData = {
                        type: 'list',
                        name: 'outputFormat',
                        default: outputFormat,
                        message: 'Please select your default output format',
                        choices: getOutputValues_1.getOutputValues(),
                        pageSize: 10,
                    };
                    return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([promptData])];
                case 2:
                    answers = _a.sent();
                    return [2 /*return*/, answers.outputFormat];
            }
        });
    });
}
exports.promptForOutputFormat = promptForOutputFormat;
//# sourceMappingURL=promptForOutputFormat.js.map