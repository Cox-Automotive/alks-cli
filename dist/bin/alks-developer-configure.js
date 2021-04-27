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
function getPrompt(field, data, text, validator) {
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
                                return data[field];
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
        var previousData, server, userid, auth, _a, _b, answers, savePassword, prompt, opts, data, e_1, _c, _d, alksAccount, _e, alksRole, promptData, answers2, outputFormat, developerPayload, e2_1, err_1;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 19, , 20]);
                    utils.log(commander_1.default, logger, 'getting developer');
                    return [4 /*yield*/, Developer.getDeveloper()];
                case 1:
                    previousData = _f.sent();
                    return [4 /*yield*/, getPrompt('server', previousData, 'ALKS server', utils.isURL)];
                case 2:
                    server = _f.sent();
                    return [4 /*yield*/, getPrompt('userid', previousData, 'Network Username', null)];
                case 3:
                    userid = _f.sent();
                    utils.log(commander_1.default, logger, 'getting existing auth');
                    return [4 /*yield*/, Developer.getAuth(commander_1.default)];
                case 4:
                    auth = _f.sent();
                    utils.log(commander_1.default, logger, 'getting existing password');
                    _a = auth;
                    return [4 /*yield*/, Developer.getPasswordFromKeystore()];
                case 5:
                    _a.password = _f.sent();
                    utils.log(commander_1.default, logger, 'getting password');
                    _b = auth;
                    return [4 /*yield*/, Developer.getPasswordFromPrompt('Network Password', auth.password)];
                case 6:
                    _b.password = _f.sent();
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'confirm',
                                name: 'savePassword',
                                message: 'Save password',
                            },
                        ])];
                case 7:
                    answers = _f.sent();
                    savePassword = answers.savePassword;
                    utils.log(commander_1.default, logger, 'Getting ALKS accounts');
                    prompt = 'Please select your default ALKS account/role';
                    commander_1.default.auth = auth; // this ensures getALKSAccount() doesnt prompt..
                    opts = {
                        prompt: prompt,
                        dontDefault: true,
                        server: server,
                        userid: userid,
                    };
                    data = void 0;
                    _f.label = 8;
                case 8:
                    _f.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, Developer.getALKSAccount(commander_1.default, opts)];
                case 9:
                    data = _f.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_1 = _f.sent();
                    if (e_1.message.indexOf('No accounts') === -1) {
                        throw e_1;
                    }
                    return [3 /*break*/, 11];
                case 11:
                    _c = data, _d = _c.alksAccount, alksAccount = _d === void 0 ? '' : _d, _e = _c.alksRole, alksRole = _e === void 0 ? '' : _e;
                    utils.log(commander_1.default, logger, 'Getting output formats');
                    promptData = {
                        type: 'list',
                        name: 'outputFormat',
                        default: previousData.outputFormat,
                        message: 'Please select your default output format',
                        choices: utils.getOutputValues(),
                        pageSize: 10,
                    };
                    return [4 /*yield*/, utils.getStdErrPrompt()([promptData])];
                case 12:
                    answers2 = _f.sent();
                    outputFormat = answers2.outputFormat;
                    developerPayload = {
                        server: server,
                        userid: userid,
                        password: auth.password,
                        savePassword: savePassword,
                        alksAccount: alksAccount,
                        alksRole: alksRole,
                        outputFormat: outputFormat,
                    };
                    // create developer
                    utils.log(commander_1.default, logger, 'saving developer');
                    _f.label = 13;
                case 13:
                    _f.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, Developer.saveDeveloper(developerPayload)];
                case 14:
                    _f.sent();
                    return [3 /*break*/, 16];
                case 15:
                    e2_1 = _f.sent();
                    if (e2_1) {
                        utils.log(commander_1.default, logger, 'error saving! ' + e2_1.message);
                        console.error(cli_color_1.default.red.bold('There was an error updating your developer configuration.'));
                    }
                    else {
                        console.error(cli_color_1.default.white('Your developer configuration has been updated.'));
                    }
                    return [3 /*break*/, 16];
                case 16:
                    utils.log(commander_1.default, logger, 'checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 17:
                    _f.sent();
                    return [4 /*yield*/, Developer.trackActivity(logger)];
                case 18:
                    _f.sent();
                    return [3 /*break*/, 20];
                case 19:
                    err_1 = _f.sent();
                    return [2 /*return*/, utils.errorAndExit('Error configuring developer: ' + err_1.message)];
                case 20: return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-developer-configure.js.map