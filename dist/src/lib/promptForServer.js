"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForServer = exports.defaultServer = void 0;
const tslib_1 = require("tslib");
const getPrompt_1 = require("./getPrompt");
const isUrl_1 = require("./isUrl");
const server_1 = require("./state/server");
exports.defaultServer = 'https://alks.coxautoinc.com/rest';
function promptForServer() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Ignore failure since we're about to prompt for it
        const server = yield (0, server_1.getServer)();
        return (0, getPrompt_1.getPrompt)('server', server || exports.defaultServer, 'ALKS server', isUrl_1.isURL);
    });
}
exports.promptForServer = promptForServer;
//# sourceMappingURL=promptForServer.js.map