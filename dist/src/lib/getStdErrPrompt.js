"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStdErrPrompt = void 0;
const inquirer_1 = require("inquirer");
function getStdErrPrompt() {
    return (0, inquirer_1.createPromptModule)({ output: process.stderr });
}
exports.getStdErrPrompt = getStdErrPrompt;
//# sourceMappingURL=getStdErrPrompt.js.map