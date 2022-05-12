"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin2fa = void 0;
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var promptForToken_1 = require("../promptForToken");
var token_1 = require("../state/token");
function handleAlksDeveloperLogin2fa(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = token_1.setToken;
                    return [4 /*yield*/, (0, promptForToken_1.promptForToken)()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 3:
                    _b.sent();
                    setTimeout(function () {
                        process.exit(0);
                    }, 1000); // needed for if browser is still open
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1.message, err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin2fa = handleAlksDeveloperLogin2fa;
//# sourceMappingURL=alks-developer-login2fa.js.map