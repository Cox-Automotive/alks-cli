"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToken = void 0;
var tslib_1 = require("tslib");
var passwordSaveErrorHandler_1 = require("./passwordSaveErrorHandler");
var storeToken_1 = require("./storeToken");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var log_1 = require("./log");
function saveToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storeToken_1.storeToken(token)];
                case 1:
                    _a.sent();
                    console.error(cli_color_1.default.white('Refresh token saved!'));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    log_1.log('error saving token! ' + err_1.message);
                    passwordSaveErrorHandler_1.passwordSaveErrorHandler(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.saveToken = saveToken;
//# sourceMappingURL=saveToken.js.map