"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForServer = exports.defaultServer = void 0;
var tslib_1 = require("tslib");
var getPrompt_1 = require("./getPrompt");
var isUrl_1 = require("./isUrl");
var server_1 = require("./state/server");
exports.defaultServer = 'https://alks.coxautoinc.com/rest';
function promptForServer() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var server;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server_1.getServer()];
                case 1:
                    server = _a.sent();
                    return [2 /*return*/, getPrompt_1.getPrompt('server', server || exports.defaultServer, 'ALKS server', isUrl_1.isURL)];
            }
        });
    });
}
exports.promptForServer = promptForServer;
//# sourceMappingURL=promptForServer.js.map