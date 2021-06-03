"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogout2fa = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var log_1 = require("../log");
var removeToken_1 = require("../removeToken");
var trackActivity_1 = require("../trackActivity");
function handleAlksDeveloperLogout2fa(_options, _program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (removeToken_1.removeToken()) {
                        console.error(cli_color_1.default.white('Token removed!'));
                    }
                    else {
                        console.error(cli_color_1.default.red.bold('Error removing token!'));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogout2fa = handleAlksDeveloperLogout2fa;
//# sourceMappingURL=alks-developer-logout2fa.js.map