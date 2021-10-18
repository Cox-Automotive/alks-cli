"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStdErrPrompt = void 0;
var inquirer_1 = require("inquirer");
function getStdErrPrompt() {
    return inquirer_1.createPromptModule({ output: process.stderr });
}
exports.getStdErrPrompt = getStdErrPrompt;
//# sourceMappingURL=getStdErrPrompt.js.map