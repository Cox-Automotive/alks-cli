"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogout = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var log_1 = require("../log");
var removePassword_1 = require("../removePassword");
function handleAlksDeveloperLogout(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var e_1, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, removePassword_1.removePassword)()];
                case 1:
                    _a.sent();
                    console.error(cli_color_1.default.white('Password removed!'));
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    (0, log_1.log)(e_1.message);
                    console.error(cli_color_1.default.red.bold('Error removing password!'));
                    return [3 /*break*/, 3];
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1.message, err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperLogout = handleAlksDeveloperLogout;
//# sourceMappingURL=alks-developer-logout.js.map