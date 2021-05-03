"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommanderError = void 0;
var handleUnknownCommand_1 = require("./handleUnknownCommand");
var log_1 = require("../log");
function handleCommanderError(program, err) {
    log_1.log(program.opts(), 'handleCommanderError', err.code);
    if (err.code === 'commander.unknownCommand') {
        handleUnknownCommand_1.handleUnknownCommand(program);
    }
}
exports.handleCommanderError = handleCommanderError;
//# sourceMappingURL=handleCommanderError.js.map