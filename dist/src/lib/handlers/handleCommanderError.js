"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommanderError = void 0;
var handleUnknownCommand_1 = require("./handleUnknownCommand");
var log_1 = require("../log");
var errorAndExit_1 = require("../errorAndExit");
function isCommanderError(err) {
    return err.code !== undefined;
}
function handleCommanderError(program, err) {
    if (isCommanderError(err)) {
        log_1.log(err.code);
        switch (err.code) {
            case 'commander.unknownCommand': {
                return handleUnknownCommand_1.handleUnknownCommand(program);
            }
            case 'commander.help':
            case 'commander.version':
            case 'commander.helpDisplayed': {
                return; // Do nothing
            }
        }
    }
    errorAndExit_1.errorAndExit(err.message, err);
}
exports.handleCommanderError = handleCommanderError;
//# sourceMappingURL=handleCommanderError.js.map