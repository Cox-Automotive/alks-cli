"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForOutputFormat = void 0;
const tslib_1 = require("tslib");
const getOutputValues_1 = require("./getOutputValues");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
const outputFormat_1 = require("./state/outputFormat");
function promptForOutputFormat() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const outputFormat = yield (0, outputFormat_1.getOutputFormat)();
        const promptData = {
            type: 'list',
            name: 'outputFormat',
            default: outputFormat,
            message: 'Please select your default output format',
            choices: (0, getOutputValues_1.getOutputValues)(),
            pageSize: 10,
        };
        const answers = yield (0, getStdErrPrompt_1.getStdErrPrompt)()([promptData]);
        return answers.outputFormat;
    });
}
exports.promptForOutputFormat = promptForOutputFormat;
//# sourceMappingURL=promptForOutputFormat.js.map