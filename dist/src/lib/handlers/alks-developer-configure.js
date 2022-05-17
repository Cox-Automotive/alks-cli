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
var promptForAuthType_2 = require("../promptForAuthType");
var credentialProcess_1 = require("../state/credentialProcess");
var promptForCredentialProcess_1 = require("../promptForCredentialProcess");
function handleAlksDeveloperConfigure(options) {
    var _a, _b, _c, _d;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var shouldPrompt, _e, _f, _g, _h, authTypeFlag, authType, _j, _k, _l, password, savePasswordAnswer, _m, _o, _p, alksAccount, alksRole, _q, _r, err_1;
        return tslib_1.__generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    _s.trys.push([0, 45, , 46]);
                    if (options.nonInteractive) {
                        console.log('Warning: configuring in non-interactive mode may leave the alks cli only partially configured. Running this command in interactive mode may still be needed to fully configure this tool');
                    }
                    shouldPrompt = !options.nonInteractive;
                    if (!(options.server || shouldPrompt)) return [3 /*break*/, 5];
                    _e = server_1.setServer;
                    if (!((_a = options.server) !== null && _a !== void 0)) return [3 /*break*/, 1];
                    _f = _a;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, promptForServer_1.promptForServer)()];
                case 2:
                    _f = (_s.sent());
                    _s.label = 3;
                case 3: return [4 /*yield*/, _e.apply(void 0, [_f])];
                case 4:
                    _s.sent();
                    _s.label = 5;
                case 5:
                    if (!(options.username || shouldPrompt)) return [3 /*break*/, 10];
                    _g = userId_1.setUserId;
                    if (!((_b = options.username) !== null && _b !== void 0)) return [3 /*break*/, 6];
                    _h = _b;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, (0, promptForUserId_1.promptForUserId)()];
                case 7:
                    _h = (_s.sent());
                    _s.label = 8;
                case 8: return [4 /*yield*/, _g.apply(void 0, [_h])];
                case 9:
                    _s.sent();
                    _s.label = 10;
                case 10:
                    authTypeFlag = options.authType;
                    if (options.credentialProcess) {
                        authTypeFlag = promptForAuthType_2.CREDENTIAL_PROCESS_AUTH_CHOICE;
                    }
                    if (!(authTypeFlag || shouldPrompt)) return [3 /*break*/, 29];
                    if (!(authTypeFlag !== null && authTypeFlag !== void 0)) return [3 /*break*/, 11];
                    _j = authTypeFlag;
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, (0, promptForAuthType_1.promptForAuthType)()];
                case 12:
                    _j = (_s.sent());
                    _s.label = 13;
                case 13:
                    authType = _j;
                    _k = authType;
                    switch (_k) {
                        case promptForAuthType_1.REFRESH_TOKEN_AUTH_CHOICE: return [3 /*break*/, 14];
                        case promptForAuthType_1.PASSWORD_AUTH_CHOICE: return [3 /*break*/, 17];
                        case promptForAuthType_2.CREDENTIAL_PROCESS_AUTH_CHOICE: return [3 /*break*/, 22];
                        case promptForAuthType_1.ALWAYS_ASK_AUTH_CHOICE: return [3 /*break*/, 27];
                    }
                    return [3 /*break*/, 28];
                case 14:
                    _l = token_1.setToken;
                    return [4 /*yield*/, (0, promptForToken_1.promptForToken)()];
                case 15: return [4 /*yield*/, _l.apply(void 0, [_s.sent()])];
                case 16:
                    _s.sent();
                    return [3 /*break*/, 29];
                case 17: return [4 /*yield*/, (0, promptForPassword_1.promptForPassword)()];
                case 18:
                    password = _s.sent();
                    return [4 /*yield*/, (0, confirm_1.confirm)('Save password')];
                case 19:
                    savePasswordAnswer = _s.sent();
                    if (!savePasswordAnswer) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, password_1.setPassword)(password)];
                case 20:
                    _s.sent();
                    _s.label = 21;
                case 21: return [3 /*break*/, 29];
                case 22:
                    _m = credentialProcess_1.setCredentialProcess;
                    if (!((_c = options.credentialProcess) !== null && _c !== void 0)) return [3 /*break*/, 23];
                    _o = _c;
                    return [3 /*break*/, 25];
                case 23: return [4 /*yield*/, (0, promptForCredentialProcess_1.promptForCredentialProcess)()];
                case 24:
                    _o = (_s.sent());
                    _s.label = 25;
                case 25: return [4 /*yield*/, _m.apply(void 0, [_o])];
                case 26:
                    _s.sent();
                    return [3 /*break*/, 29];
                case 27:
                    {
                        // do nothing
                        return [3 /*break*/, 29];
                    }
                    _s.label = 28;
                case 28:
                    {
                        throw new Error('Invalid auth type selected');
                    }
                    _s.label = 29;
                case 29:
                    if (!(options.account && options.role)) return [3 /*break*/, 33];
                    return [4 /*yield*/, (0, validateAlksAccount_1.validateAlksAccount)(options.account, options.role)];
                case 30:
                    _s.sent();
                    return [4 /*yield*/, (0, alksAccount_1.setAlksAccount)(options.account)];
                case 31:
                    _s.sent();
                    return [4 /*yield*/, (0, alksRole_1.setAlksRole)(options.role)];
                case 32:
                    _s.sent();
                    return [3 /*break*/, 37];
                case 33:
                    if (!shouldPrompt) return [3 /*break*/, 37];
                    (0, log_1.log)('Getting ALKS accounts');
                    return [4 /*yield*/, (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                            prompt: 'Please select your default ALKS account/role',
                        })];
                case 34:
                    _p = _s.sent(), alksAccount = _p.alksAccount, alksRole = _p.alksRole;
                    return [4 /*yield*/, (0, alksAccount_1.setAlksAccount)(alksAccount)];
                case 35:
                    _s.sent();
                    return [4 /*yield*/, (0, alksRole_1.setAlksRole)(alksRole)];
                case 36:
                    _s.sent();
                    _s.label = 37;
                case 37:
                    if (!(options.output || shouldPrompt)) return [3 /*break*/, 41];
                    (0, log_1.log)('Getting output formats');
                    _q = outputFormat_1.setOutputFormat;
                    if (!((_d = options.output) !== null && _d !== void 0)) return [3 /*break*/, 38];
                    _r = _d;
                    return [3 /*break*/, 40];
                case 38: return [4 /*yield*/, (0, promptForOutputFormat_1.promptForOutputFormat)()];
                case 39:
                    _r = (_s.sent());
                    _s.label = 40;
                case 40:
                    _q.apply(void 0, [_r]);
                    _s.label = 41;
                case 41:
                    console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    if (!(process.stdin.isTTY && shouldPrompt)) return [3 /*break*/, 43];
                    return [4 /*yield*/, tabtab_1.default.install({
                            name: 'alks',
                            completer: 'alks',
                        })];
                case 42:
                    _s.sent();
                    _s.label = 43;
                case 43: return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 44:
                    _s.sent();
                    return [3 /*break*/, 46];
                case 45:
                    err_1 = _s.sent();
                    (0, errorAndExit_1.errorAndExit)('Error configuring developer: ' + err_1.message, err_1);
                    return [3 /*break*/, 46];
                case 46: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map