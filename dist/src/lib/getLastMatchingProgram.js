"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastMatchingProgram = void 0;
function getLastMatchingProgram(program) {
    var command = program;
    var _loop_1 = function (arg) {
        var commands = command.commands.map(function (c) { return c.name(); });
        if (!commands.includes(arg)) {
            return "break";
        }
        command = command.commands.find(function (c) { return c.name() == arg; });
    };
    for (var _i = 0, _a = program.args; _i < _a.length; _i++) {
        var arg = _a[_i];
        var state_1 = _loop_1(arg);
        if (state_1 === "break")
            break;
    }
    return command;
}
exports.getLastMatchingProgram = getLastMatchingProgram;
//# sourceMappingURL=getLastMatchingProgram.js.map