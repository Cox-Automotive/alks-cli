#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var utils = tslib_1.__importStar(require("../lib/utils"));
var Developer = tslib_1.__importStar(require("../lib/developer"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
commander_1.default
    .version(package_json_1.default.version)
    .description('configures developer')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var logger = 'dev-config';
function getPrompt(field, defaultValue, text, validator) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.getStdErrPrompt()([
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
                                    return !underscore_1.default.isEmpty(val)
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
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var previousDeveloper, e_1, server, userid, password, answers, savePassword, auth, e_2, prompt, opts, _a, alksAccount, alksRole, promptData, answers2, outputFormat, newDeveloper, e2_1, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 24, , 25]);
                    utils.log(commander_1.default, logger, 'getting developer');
                    previousDeveloper = void 0;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Developer.getDeveloper()];
                case 2:
                    previousDeveloper = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, getPrompt('server', previousDeveloper === null || previousDeveloper === void 0 ? void 0 : previousDeveloper.server, 'ALKS server', utils.isURL)];
                case 5:
                    server = _b.sent();
                    return [4 /*yield*/, getPrompt('userid', previousDeveloper === null || previousDeveloper === void 0 ? void 0 : previousDeveloper.userid, 'Network Username', null)];
                case 6:
                    userid = _b.sent();
                    utils.log(commander_1.default, logger, 'getting existing password');
                    return [4 /*yield*/, Developer.getPasswordFromKeystore()];
                case 7:
                    password = _b.sent();
                    utils.log(commander_1.default, logger, 'getting password');
                    return [4 /*yield*/, Developer.getPasswordFromPrompt('Network Password', password)];
                case 8:
                    password = _b.sent();
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'confirm',
                                name: 'savePassword',
                                message: 'Save password',
                            },
                        ])];
                case 9:
                    answers = _b.sent();
                    savePassword = answers.savePassword;
                    if (!savePassword) return [3 /*break*/, 11];
                    return [4 /*yield*/, Developer.savePassword(password)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    auth = void 0;
                    _b.label = 12;
                case 12:
                    _b.trys.push([12, 14, , 15]);
                    utils.log(commander_1.default, logger, 'getting existing auth');
                    return [4 /*yield*/, Developer.getAuth(commander_1.default, false)];
                case 13:
                    auth = _b.sent();
                    return [3 /*break*/, 15];
                case 14:
                    e_2 = _b.sent();
                    // it's ok if no auth exists since we're configuring it now
                    auth = {};
                    return [3 /*break*/, 15];
                case 15:
                    // Cache password in program object for faster lookup
                    commander_1.default.auth = tslib_1.__assign({ userid: userid,
                        password: password }, auth);
                    utils.log(commander_1.default, logger, 'Getting ALKS accounts');
                    prompt = 'Please select your default ALKS account/role';
                    opts = {
                        prompt: prompt,
                        server: server,
                        userid: userid,
                    };
                    return [4 /*yield*/, Developer.getAlksAccount(commander_1.default, opts)];
                case 16:
                    _a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole;
                    utils.log(commander_1.default, logger, 'Getting output formats');
                    promptData = {
                        type: 'list',
                        name: 'outputFormat',
                        default: previousDeveloper === null || previousDeveloper === void 0 ? void 0 : previousDeveloper.outputFormat,
                        message: 'Please select your default output format',
                        choices: utils.getOutputValues(),
                        pageSize: 10,
                    };
                    return [4 /*yield*/, utils.getStdErrPrompt()([promptData])];
                case 17:
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
                    utils.log(commander_1.default, logger, 'saving developer');
                    _b.label = 18;
                case 18:
                    _b.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, Developer.saveDeveloper(newDeveloper)];
                case 19:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 20:
                    e2_1 = _b.sent();
                    if (e2_1) {
                        utils.log(commander_1.default, logger, 'error saving! ' + e2_1.message);
                        console.error(cli_color_1.default.red.bold('There was an error updating your developer configuration.'));
                    }
                    else {
                        console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    }
                    return [3 /*break*/, 21];
                case 21:
                    utils.log(commander_1.default, logger, 'checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, Developer.trackActivity(logger)];
                case 23:
                    _b.sent();
                    return [3 /*break*/, 25];
                case 24:
                    err_1 = _b.sent();
                    return [2 /*return*/, utils.errorAndExit('Error configuring developer: ' + err_1.message)];
                case 25: return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-developer-configure.js.map