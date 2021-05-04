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
function handleAlksDeveloperConfigure(_, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var logger, server, userId, password, savePasswordAnswer, _a, alksAccount, alksRole, outputFormat, e2_1, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger = 'dev-config';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 16, , 17]);
                    return [4 /*yield*/, promptForServer_1.promptForServer()];
                case 2:
                    server = _b.sent();
                    return [4 /*yield*/, promptForUserId_1.promptForUserId()];
                case 3:
                    userId = _b.sent();
                    log_1.log(program, logger, 'getting password');
                    return [4 /*yield*/, promptForPassword_1.promptForPassword()];
                case 4:
                    password = _b.sent();
                    return [4 /*yield*/, confirm_1.confirm('Save password')];
                case 5:
                    savePasswordAnswer = _b.sent();
                    if (!savePasswordAnswer) return [3 /*break*/, 7];
                    return [4 /*yield*/, savePassword_1.savePassword(password)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    // Cache password in program object for faster lookup
                    getAuth_1.cacheAuth({
                        userid: userId,
                        password: password,
                    });
                    log_1.log(program, logger, 'Getting ALKS accounts');
                    return [4 /*yield*/, getAlksAccount_1.getAlksAccount(program, {
                            prompt: 'Please select your default ALKS account/role',
                            server: server,
                        })];
                case 8:
                    _a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole;
                    log_1.log(program, logger, 'Getting output formats');
                    return [4 /*yield*/, promptForOutputFormat_1.promptForOutputFormat()];
                case 9:
                    outputFormat = _b.sent();
                    // create developer
                    log_1.log(program, logger, 'saving developer');
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, saveDeveloper_1.saveDeveloper({
                            server: server,
                            userid: userId,
                            alksAccount: alksAccount,
                            alksRole: alksRole,
                            outputFormat: outputFormat,
                        })];
                case 11:
                    _b.sent();
                    console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    return [3 /*break*/, 13];
                case 12:
                    e2_1 = _b.sent();
                    log_1.log(program, logger, 'error saving! ' + e2_1.message);
                    console.error(cli_color_1.default.red.bold('There was an error updating your developer configuration.'));
                    return [3 /*break*/, 13];
                case 13:
                    log_1.log(program, logger, 'checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity(logger)];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _b.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit('Error configuring developer: ' + err_1.message, err_1)];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map