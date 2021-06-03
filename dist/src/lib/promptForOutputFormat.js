"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForOutputFormat = void 0;
var tslib_1 = require("tslib");
var getDeveloper_1 = require("./getDeveloper");
var getOutputValues_1 = require("./getOutputValues");
var getStdErrPrompt_1 = require("./getStdErrPrompt");
function promptForOutputFormat() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, err_1, promptData, answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3:
                    promptData = {
                        type: 'list',
                        name: 'outputFormat',
                        default: developer === null || developer === void 0 ? void 0 : developer.outputFormat,
                        message: 'Please select your default output format',
                        choices: getOutputValues_1.getOutputValues(),
                        pageSize: 10,
                    };
                    return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([promptData])];
                case 4:
                    answers = _a.sent();
                    return [2 /*return*/, answers.outputFormat];
            }
        });
    });
}
exports.promptForOutputFormat = promptForOutputFormat;
//# sourceMappingURL=promptForOutputFormat.js.map