"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperConfigure = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var confirm_1 = require("../confirm");
var errorAndExit_1 = require("../errorAndExit");
var getAlksAccount_1 = require("../getAlksAccount");
var getAuth_1 = require("../getAuth");
var log_1 = require("../log");
var promptForOutputFormat_1 = require("../promptForOutputFormat");
var promptForPassword_1 = require("../promptForPassword");
var promptForServer_1 = require("../promptForServer");
var promptForUserId_1 = require("../promptForUserId");
var saveDeveloper_1 = require("../saveDeveloper");
var savePassword_1 = require("../savePassword");
var trackActivity_1 = require("../trackActivity");
function handleAlksDeveloperConfigure(_options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var server, userId, password, savePasswordAnswer, _a, alksAccount, alksRole, outputFormat, e2_1, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, promptForServer_1.promptForServer()];
                case 1:
                    server = _b.sent();
                    return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 2:
                    userId = _b.sent();
                    log_1.log('getting password');
                    return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 3:
                    password = _b.sent();
                    return [4 /*yield*/, confirm_1.confirm('Save password')];
                case 4:
                    savePasswordAnswer = _b.sent();
                    if (!savePasswordAnswer) return [3 /*break*/, 6];
                    return [4 /*yield*/, savePassword_1.savePassword(password)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    // Cache password in program object for faster lookup
                    getAuth_1.cacheAuth({
                        userid: userId,
                        password: password,
                    });
                    log_1.log('Getting ALKS accounts');
                    return [4 /*yield*/, getAlksAccount_1.getAlksAccount(program, {
                            prompt: 'Please select your default ALKS account/role',
                            server: server,
                        })];
                case 7:
                    _a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole;
                    log_1.log('Getting output formats');
                    return [4 /*yield*/, promptForOutputFormat_1.promptForOutputFormat()];
                case 8:
                    outputFormat = _b.sent();
                    // create developer
                    log_1.log('saving developer');
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, saveDeveloper_1.saveDeveloper({
                            server: server,
                            userid: userId,
                            alksAccount: alksAccount,
                            alksRole: alksRole,
                            outputFormat: outputFormat,
                        })];
                case 10:
                    _b.sent();
                    console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    return [3 /*break*/, 12];
                case 11:
                    e2_1 = _b.sent();
                    log_1.log('error saving! ' + e2_1.message);
                    console.error(cli_color_1.default.red.bold('There was an error updating your developer configuration.'));
                    return [3 /*break*/, 12];
                case 12:
                    log_1.log('checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 14:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 15:
                    err_1 = _b.sent();
                    errorAndExit_1.errorAndExit('Error configuring developer: ' + err_1.message, err_1);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map