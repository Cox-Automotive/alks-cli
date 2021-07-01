"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePassword = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var log_1 = require("./log");
var passwordSaveErrorHandler_1 = require("./passwordSaveErrorHandler");
var storePassword_1 = require("./storePassword");
function savePassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storePassword_1.storePassword(password)];
                case 1:
                    _a.sent();
                    console.error(cli_color_1.default.white('Password saved!'));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    log_1.log('error saving password! ' + err_1.message);
                    passwordSaveErrorHandler_1.passwordSaveErrorHandler(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.savePassword = savePassword;
//# sourceMappingURL=savePassword.js.map