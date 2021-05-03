"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogout = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var log_1 = require("../log");
var removePassword_1 = require("../removePassword");
var tractActivity_1 = require("../tractActivity");
function handleAlksDeveloperLogout(_options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var logger, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = 'dev-logout';
                    if (removePassword_1.removePassword()) {
                        console.error(cli_color_1.default.white('Password removed!'));
                    }
                    else {
                        console.error(cli_color_1.default.red.bold('Error removing password!'));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    log_1.log(program, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tractActivity_1.trackActivity(logger)];
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
exports.handleAlksDeveloperLogout = handleAlksDeveloperLogout;
//# sourceMappingURL=alks-developer-logout.js.map