"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperConfigure = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlksAccount_1 = require("../getAlksAccount");
var getAuth_1 = require("../getAuth");
var getDeveloper_1 = require("../getDeveloper");
var getOutputValues_1 = require("../getOutputValues");
var getPasswordFromKeystore_1 = require("../getPasswordFromKeystore");
var getPasswordFromPrompt_1 = require("../getPasswordFromPrompt");
var getStdErrPrompt_1 = require("../getStdErrPrompt");
var isUrl_1 = require("../isUrl");
var log_1 = require("../log");
var saveDeveloper_1 = require("../saveDeveloper");
var tractActivity_1 = require("../tractActivity");
function handleAlksDeveloperConfigure(_, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function getPrompt(field, defaultValue, text, validator) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var answers;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([
                                {
                                    type: 'input',
                                    name: field,
                                    message: text,
                                    default: function () {
                                        return defaultValue;
                                    },
                                    validate: validator
                                        ? validator
                                        : function (val) {
                                            return !underscore_1.isEmpty(val)
                                                ? true
                                                : 'Please enter a value for ' + text + '.';
                                        },
                                },
                            ])];
                        case 1:
                            answers = _a.sent();
                            return [2 /*return*/, answers[field]];
                    }
                });
            });
        }
        var logger, previousDeveloper, e_1, server, userid, password, answers, savePassword, auth, e_2, prompt, opts, _a, alksAccount, alksRole, promptData, answers2, outputFormat, newDeveloper, e2_1, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger = 'dev-config';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 25, , 26]);
                    log_1.log(program, logger, 'getting developer');
                    previousDeveloper = void 0;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 3:
                    previousDeveloper = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, getPrompt('server', previousDeveloper === null || previousDeveloper === void 0 ? void 0 : previousDeveloper.server, 'ALKS server', isUrl_1.isURL)];
                case 6:
                    server = _b.sent();
                    return [4 /*yield*/, getPrompt('userid', previousDeveloper === null || previousDeveloper === void 0 ? void 0 : previousDeveloper.userid, 'Network Username', null)];
                case 7:
                    userid = _b.sent();
                    log_1.log(program, logger, 'getting existing password');
                    return [4 /*yield*/, getPasswordFromKeystore_1.getPasswordFromKeystore()];
                case 8:
                    password = _b.sent();
                    log_1.log(program, logger, 'getting password');
                    return [4 /*yield*/, getPasswordFromPrompt_1.getPasswordFromPrompt('Network Password', password)];
                case 9:
                    password = _b.sent();
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'confirm',
                                name: 'savePassword',
                                message: 'Save password',
                            },
                        ])];
                case 10:
                    answers = _b.sent();
                    savePassword = answers.savePassword;
                    if (!savePassword) return [3 /*break*/, 12];
                    return [4 /*yield*/, savePassword(password)];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    auth = void 0;
                    _b.label = 13;
                case 13:
                    _b.trys.push([13, 15, , 16]);
                    log_1.log(program, logger, 'getting existing auth');
                    return [4 /*yield*/, getAuth_1.getAuth(program, false)];
                case 14:
                    auth = _b.sent();
                    return [3 /*break*/, 16];
                case 15:
                    e_2 = _b.sent();
                    // it's ok if no auth exists since we're configuring it now
                    auth = {};
                    return [3 /*break*/, 16];
                case 16:
                    // Cache password in program object for faster lookup
                    getAuth_1.saveAuth(tslib_1.__assign({ userid: userid,
                        password: password }, auth));
                    log_1.log(program, logger, 'Getting ALKS accounts');
                    prompt = 'Please select your default ALKS account/role';
                    opts = {
                        prompt: prompt,
                        server: server,
                        userid: userid,
                    };
                    return [4 /*yield*/, getAlksAccount_1.getAlksAccount(program, opts)];
                case 17:
                    _a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole;
                    log_1.log(program, logger, 'Getting output formats');
                    promptData = {
                        type: 'list',
                        name: 'outputFormat',
                        default: previousDeveloper === null || previousDeveloper === void 0 ? void 0 : previousDeveloper.outputFormat,
                        message: 'Please select your default output format',
                        choices: getOutputValues_1.getOutputValues(),
                        pageSize: 10,
                    };
                    return [4 /*yield*/, getStdErrPrompt_1.getStdErrPrompt()([promptData])];
                case 18:
                    answers2 = _b.sent();
                    outputFormat = answers2.outputFormat;
                    newDeveloper = {
                        server: server,
                        userid: userid,
                        alksAccount: alksAccount,
                        alksRole: alksRole,
                        outputFormat: outputFormat,
                    };
                    // create developer
                    log_1.log(program, logger, 'saving developer');
                    _b.label = 19;
                case 19:
                    _b.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, saveDeveloper_1.saveDeveloper(newDeveloper)];
                case 20:
                    _b.sent();
                    return [3 /*break*/, 22];
                case 21:
                    e2_1 = _b.sent();
                    if (e2_1) {
                        log_1.log(program, logger, 'error saving! ' + e2_1.message);
                        console.error(cli_color_1.default.red.bold('There was an error updating your developer configuration.'));
                    }
                    else {
                        console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    }
                    return [3 /*break*/, 22];
                case 22:
                    log_1.log(program, logger, 'checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, tractActivity_1.trackActivity(logger)];
                case 24:
                    _b.sent();
                    return [3 /*break*/, 26];
                case 25:
                    err_1 = _b.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit('Error configuring developer: ' + err_1.message, err_1)];
                case 26: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperConfigure = handleAlksDeveloperConfigure;
//# sourceMappingURL=alks-developer-configure.js.map