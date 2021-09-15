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
var trackActivity_1 = require("../trackActivity");
var server_1 = require("../state/server");
var userId_1 = require("../state/userId");
var alksAccount_1 = require("../state/alksAccount");
var alksRole_1 = require("../state/alksRole");
var outputFormat_1 = require("../state/outputFormat");
var promptForToken_1 = require("../promptForToken");
var promptForAuthType_1 = require("../promptForAuthType");
var validateAlksAccount_1 = require("../validateAlksAccount");
var tabtab_1 = tslib_1.__importDefault(require("tabtab"));
var token_1 = require("../state/token");
var password_1 = require("../state/password");
function handleAlksDeveloperConfigure(options) {
    var _a, _b, _c, _d;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _e, _f, _g, _h, authType, _j, _k, _l, password, savePasswordAnswer, _m, alksAccount, alksRole, _o, _p, err_1;
        return tslib_1.__generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    _q.trys.push([0, 37, , 38]);
                    _e = server_1.setServer;
                    if (!((_a = options.server) !== null && _a !== void 0)) return [3 /*break*/, 1];
                    _f = _a;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, promptForServer_1.promptForServer()];
                case 2:
                    _f = (_q.sent());
                    _q.label = 3;
                case 3: return [4 /*yield*/, _e.apply(void 0, [_f])];
                case 4:
                    _q.sent();
                    _g = userId_1.setUserId;
                    if (!((_b = options.username) !== null && _b !== void 0)) return [3 /*break*/, 5];
                    _h = _b;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 6:
                    _h = (_q.sent());
                    _q.label = 7;
                case 7: return [4 /*yield*/, _g.apply(void 0, [_h])];
                case 8:
                    _q.sent();
                    if (!((_c = options.authType) !== null && _c !== void 0)) return [3 /*break*/, 9];
                    _j = _c;
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, promptForAuthType_1.promptForAuthType()];
                case 10:
                    _j = (_q.sent());
                    _q.label = 11;
                case 11:
                    authType = _j;
                    _k = authType;
                    switch (_k) {
                        case promptForAuthType_1.REFRESH_TOKEN_AUTH_CHOICE: return [3 /*break*/, 12];
                        case promptForAuthType_1.PASSWORD_AUTH_CHOICE: return [3 /*break*/, 15];
                        case promptForAuthType_1.ALWAYS_ASK_AUTH_CHOICE: return [3 /*break*/, 20];
                    }
                    return [3 /*break*/, 21];
                case 12:
                    _l = token_1.setToken;
                    return [4 /*yield*/, promptForToken_1.promptForToken()];
                case 13: return [4 /*yield*/, _l.apply(void 0, [_q.sent()])];
                case 14:
                    _q.sent();
                    return [3 /*break*/, 22];
                case 15: return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 16:
                    password = _q.sent();
                    return [4 /*yield*/, confirm_1.confirm('Save password')];
                case 17:
                    savePasswordAnswer = _q.sent();
                    if (!savePasswordAnswer) return [3 /*break*/, 19];
                    return [4 /*yield*/, password_1.setPassword(password)];
                case 18:
                    _q.sent();
                    _q.label = 19;
                case 19: return [3 /*break*/, 22];
                case 20:
                    {
                        // do nothing
                        return [3 /*break*/, 22];
                    }
                    _q.label = 21;
                case 21:
                    {
                        throw new Error('Invalid auth type selected');
                    }
                    _q.label = 22;
                case 22:
                    if (!(!options.account || !options.role)) return [3 /*break*/, 26];
                    log_1.log('Getting ALKS accounts');
                    return [4 /*yield*/, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole({
                            prompt: 'Please select your default ALKS account/role',
                        })];
                case 23:
                    _m = _q.sent(), alksAccount = _m.alksAccount, alksRole = _m.alksRole;
                    return [4 /*yield*/, alksAccount_1.setAlksAccount(alksAccount)];
                case 24:
                    _q.sent();
                    return [4 /*yield*/, alksRole_1.setAlksRole(alksRole)];
                case 25:
                    _q.sent();
                    return [3 /*break*/, 30];
                case 26: return [4 /*yield*/, validateAlksAccount_1.validateAlksAccount(options.account, options.role)];
                case 27:
                    _q.sent();
                    return [4 /*yield*/, alksAccount_1.setAlksAccount(options.account)];
                case 28:
                    _q.sent();
                    return [4 /*yield*/, alksRole_1.setAlksRole(options.role)];
                case 29:
                    _q.sent();
                    _q.label = 30;
                case 30:
                    log_1.log('Getting output formats');
                    _o = outputFormat_1.setOutputFormat;
                    if (!((_d = options.format) !== null && _d !== void 0)) return [3 /*break*/, 31];
                    _p = _d;
                    return [3 /*break*/, 33];
                case 31: return [4 /*yield*/, promptForOutputFormat_1.promptForOutputFormat()];
                case 32:
                    _p = (_q.sent());
                    _q.label = 33;
                case 33:
                    _o.apply(void 0, [_p]);
                    // create developer
                    console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    return [4 /*yield*/, tabtab_1.default.install({
                            name: 'alks',
                            completer: 'alks',
                        })];
                case 34:
                    _q.sent();
                    log_1.log('checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 35:
                    _q.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 36:
                    _q.sent();
                    return [3 /*break*/, 38];
                case 37:
                    err_1 = _q.sent();
                    errorAndExit_1.errorAndExit('Error configuring developer: ' + err_1.message, err_1);
                    return [3 /*break*/, 38];
                case 38: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map