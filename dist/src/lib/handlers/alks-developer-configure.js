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
var saveToken_1 = require("../saveToken");
var promptForToken_1 = require("../promptForToken");
var promptForAuthType_1 = require("../promptForAuthType");
var validateAlksAccount_1 = require("../validateAlksAccount");
function handleAlksDeveloperConfigure(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, authTypeAnswer, _e, password, savePasswordAnswer, _f, alksAccount, alksRole, _g, _h, err_1;
        return tslib_1.__generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 28, , 29]);
                    _a = server_1.setServer;
                    _b = options.server;
                    if (_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, promptForServer_1.promptForServer()];
                case 1:
                    _b = (_j.sent());
                    _j.label = 2;
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b])];
                case 3:
                    _j.sent();
                    _c = userId_1.setUserId;
                    _d = options.username;
                    if (_d) return [3 /*break*/, 5];
                    return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 4:
                    _d = (_j.sent());
                    _j.label = 5;
                case 5: return [4 /*yield*/, _c.apply(void 0, [_d])];
                case 6:
                    _j.sent();
                    if (options.password && options.token) {
                        throw new Error('Invalid options: Cannot pass both -p/--password and -t/--token. Choose one or pass neither');
                    }
                    if (!!(options.password || options.token)) return [3 /*break*/, 8];
                    return [4 /*yield*/, promptForAuthType_1.promptForAuthType()];
                case 7:
                    authTypeAnswer = _j.sent();
                    options.token = authTypeAnswer === 'OAuth2 Refresh Token';
                    options.password = !options.token;
                    _j.label = 8;
                case 8:
                    if (!options.token) return [3 /*break*/, 11];
                    _e = saveToken_1.saveToken;
                    return [4 /*yield*/, promptForToken_1.promptForToken()];
                case 9: return [4 /*yield*/, _e.apply(void 0, [_j.sent()])];
                case 10:
                    _j.sent();
                    return [3 /*break*/, 15];
                case 11: return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 12:
                    password = _j.sent();
                    return [4 /*yield*/, confirm_1.confirm('Save password')];
                case 13:
                    savePasswordAnswer = _j.sent();
                    if (!savePasswordAnswer) return [3 /*break*/, 15];
                    return [4 /*yield*/, savePassword_1.savePassword(password)];
                case 14:
                    _j.sent();
                    _j.label = 15;
                case 15:
                    if (!(!options.account || !options.role)) return [3 /*break*/, 19];
                    log_1.log('Getting ALKS accounts');
                    return [4 /*yield*/, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole({
                            prompt: 'Please select your default ALKS account/role',
                        })];
                case 16:
                    _f = _j.sent(), alksAccount = _f.alksAccount, alksRole = _f.alksRole;
                    return [4 /*yield*/, alksAccount_1.setAlksAccount(alksAccount)];
                case 17:
                    _j.sent();
                    return [4 /*yield*/, alksRole_1.setAlksRole(alksRole)];
                case 18:
                    _j.sent();
                    return [3 /*break*/, 23];
                case 19: return [4 /*yield*/, validateAlksAccount_1.validateAlksAccount(options.account, options.role)];
                case 20:
                    _j.sent();
                    return [4 /*yield*/, alksAccount_1.setAlksAccount(options.account)];
                case 21:
                    _j.sent();
                    return [4 /*yield*/, alksRole_1.setAlksRole(options.role)];
                case 22:
                    _j.sent();
                    _j.label = 23;
                case 23:
                    log_1.log('Getting output formats');
                    _g = outputFormat_1.setOutputFormat;
                    _h = options.format;
                    if (_h) return [3 /*break*/, 25];
                    return [4 /*yield*/, promptForOutputFormat_1.promptForOutputFormat()];
                case 24:
                    _h = (_j.sent());
                    _j.label = 25;
                case 25:
                    _g.apply(void 0, [_h]);
                    // create developer
                    console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    log_1.log('checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 26:
                    _j.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 27:
                    _j.sent();
                    return [3 /*break*/, 29];
                case 28:
                    err_1 = _j.sent();
                    errorAndExit_1.errorAndExit('Error configuring developer: ' + err_1.message, err_1);
                    return [3 /*break*/, 29];
                case 29: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map