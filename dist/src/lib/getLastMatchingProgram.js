"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastMatchingProgram = void 0;
function getLastMatchingProgram(program) {
    let command = program;
    for (const arg of program.args) {
        const commands = command.commands.map((c) => c.name());
        if (!commands.includes(arg)) {
            break;
        }
        command = command.commands.find((c) => c.name() == arg);
    }
    return command;
}
exports.getLastMatchingProgram = getLastMatchingProgram;
//# sourceMappingURL=getLastMatchingProgram.js.map