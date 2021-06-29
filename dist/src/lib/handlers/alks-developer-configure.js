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
var tabtab_1 = tslib_1.__importDefault(require("tabtab"));
function handleAlksDeveloperConfigure(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, _b, password, savePasswordAnswer, _c, alksAccount, alksRole, _d, err_1;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 16, , 17]);
                    _a = server_1.setServer;
                    return [4 /*yield*/, promptForServer_1.promptForServer()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])];
                case 2:
                    _e.sent();
                    _b = userId_1.setUserId;
                    return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 3: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 5:
                    password = _e.sent();
                    return [4 /*yield*/, confirm_1.confirm('Save password')];
                case 6:
                    savePasswordAnswer = _e.sent();
                    if (!savePasswordAnswer) return [3 /*break*/, 8];
                    return [4 /*yield*/, savePassword_1.savePassword(password)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    log_1.log('Getting ALKS accounts');
                    return [4 /*yield*/, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole({
                            prompt: 'Please select your default ALKS account/role',
                        })];
                case 9:
                    _c = _e.sent(), alksAccount = _c.alksAccount, alksRole = _c.alksRole;
                    return [4 /*yield*/, alksAccount_1.setAlksAccount(alksAccount)];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, alksRole_1.setAlksRole(alksRole)];
                case 11:
                    _e.sent();
                    log_1.log('Getting output formats');
                    _d = outputFormat_1.setOutputFormat;
                    return [4 /*yield*/, promptForOutputFormat_1.promptForOutputFormat()];
                case 12:
                    _d.apply(void 0, [_e.sent()]);
                    // create developer
                    console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    return [4 /*yield*/, tabtab_1.default.install({
                            name: 'alks',
                            completer: 'alks',
                        })];
                case 13:
                    _e.sent();
                    log_1.log('checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 14:
                    _e.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 15:
                    _e.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _e.sent();
                    errorAndExit_1.errorAndExit('Error configuring developer: ' + err_1.message, err_1);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map