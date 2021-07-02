"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperConfigure = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var confirm_1 = require("../confirm");
var errorAndExit_1 = require("../errorAndExit");
var promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
var log_1 = require("../log");
var promptForOutputFormat_1 = require("../promptForOutputFormat");
var promptForPassword_1 = require("../promptForPassword");
var promptForServer_1 = require("../promptForServer");
var promptForUserId_1 = require("../promptForUserId");
var savePassword_1 = require("../savePassword");
var trackActivity_1 = require("../trackActivity");
var server_1 = require("../state/server");
var userId_1 = require("../state/userId");
var alksAccount_1 = require("../state/alksAccount");
var alksRole_1 = require("../state/alksRole");
var outputFormat_1 = require("../state/outputFormat");
function handleAlksDeveloperConfigure(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, password, savePasswordAnswer, _d, alksAccount, alksRole, _e, err_1;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 16, , 17]);
                    _a = server_1.setServer;
                    _b = options.server;
                    if (_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, promptForServer_1.promptForServer()];
                case 1:
                    _b = (_f.sent());
                    _f.label = 2;
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b])];
                case 3:
                    _f.sent();
                    _c = userId_1.setUserId;
                    return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 4: return [4 /*yield*/, _c.apply(void 0, [_f.sent()])];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 6:
                    password = _f.sent();
                    return [4 /*yield*/, confirm_1.confirm('Save password')];
                case 7:
                    savePasswordAnswer = _f.sent();
                    if (!savePasswordAnswer) return [3 /*break*/, 9];
                    return [4 /*yield*/, savePassword_1.savePassword(password)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9:
                    log_1.log('Getting ALKS accounts');
                    return [4 /*yield*/, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole({
                            prompt: 'Please select your default ALKS account/role',
                        })];
                case 10:
                    _d = _f.sent(), alksAccount = _d.alksAccount, alksRole = _d.alksRole;
                    return [4 /*yield*/, alksAccount_1.setAlksAccount(alksAccount)];
                case 11:
                    _f.sent();
                    return [4 /*yield*/, alksRole_1.setAlksRole(alksRole)];
                case 12:
                    _f.sent();
                    log_1.log('Getting output formats');
                    _e = outputFormat_1.setOutputFormat;
                    return [4 /*yield*/, promptForOutputFormat_1.promptForOutputFormat()];
                case 13:
                    _e.apply(void 0, [_f.sent()]);
                    // create developer
                    console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    log_1.log('checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 14:
                    _f.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 15:
                    _f.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _f.sent();
                    errorAndExit_1.errorAndExit('Error configuring developer: ' + err_1.message, err_1);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map