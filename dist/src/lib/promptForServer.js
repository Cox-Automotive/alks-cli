"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForServer = void 0;
var tslib_1 = require("tslib");
var getDeveloper_1 = require("./getDeveloper");
var getPrompt_1 = require("./getPrompt");
var isUrl_1 = require("./isUrl");
function promptForServer() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, getPrompt_1.getPrompt('server', developer === null || developer === void 0 ? void 0 : developer.server, 'ALKS server', isUrl_1.isURL)];
            }
        });
    });
}
exports.promptForServer = promptForServer;
//# sourceMappingURL=promptForServer.js.map