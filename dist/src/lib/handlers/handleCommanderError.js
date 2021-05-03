"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommanderError = void 0;
var handleUnknownCommand_1 = require("./handleUnknownCommand");
var log_1 = require("../log");
// import { getLastMatchingProgram } from '../getLastMatchingProgram';
function handleCommanderError(program, err) {
    log_1.log(program.opts(), 'handleCommanderError', err.code);
    if (err.code === 'commander.unknownCommand') {
        handleUnknownCommand_1.handleUnknownCommand(program);
        // } else if (program.commands.length) {
        //   const latestProgram = getLastMatchingProgram(program);
        //   try {
        //     latestProgram.help();
        //   } catch (err) {
        //     // do nothing
        //   }
    }
}
exports.handleCommanderError = handleCommanderError;
//# sourceMappingURL=handleCommanderError.js.map