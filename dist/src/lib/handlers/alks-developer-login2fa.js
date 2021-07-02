"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogin2fa = void 0;
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var saveToken_1 = require("../saveToken");
var promptForToken_1 = require("../promptForToken");
function handleAlksDeveloperLogin2fa(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = saveToken_1.saveToken;
                    return [4 /*yield*/, promptForToken_1.promptForToken()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                case 2:
                    _b.sent();
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 4:
                    _b.sent();
                    setTimeout(function () {
                        process.exit(0);
                    }, 1000); // needed for if browser is still open
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogin2fa = handleAlksDeveloperLogin2fa;
//# sourceMappingURL=alks-developer-login2fa.js.map