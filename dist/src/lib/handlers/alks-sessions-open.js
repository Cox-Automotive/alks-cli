"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsOpen = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getDeveloper_1 = require("../getDeveloper");
var getIamKey_1 = require("../getIamKey");
var getKeyOutput_1 = require("../getKeyOutput");
var getSessionKey_1 = require("../getSessionKey");
var log_1 = require("../log");
var tractActivity_1 = require("../tractActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksSessionsOpen(program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var options, alksAccount, alksRole, forceNewSession, useDefaultAcct, output, filterFaves, logger, developer, err_1, key, err_2, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = program.opts();
                    alksAccount = options.account;
                    alksRole = options.role;
                    forceNewSession = options.newSession;
                    useDefaultAcct = options.default;
                    output = options.output;
                    filterFaves = options.favorites || false;
                    logger = 'sessions-open';
                    if (!underscore_1.isUndefined(alksAccount) && underscore_1.isUndefined(alksRole)) {
                        log_1.log(program, logger, 'trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 15, , 16]);
                    developer = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 3:
                    developer = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit('Unable to load default account!', err_1)];
                case 5:
                    if (useDefaultAcct) {
                        alksAccount = developer.alksAccount;
                        alksRole = developer.alksRole;
                    }
                    key = void 0;
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 11, , 12]);
                    if (!underscore_1.isUndefined(options.iam)) return [3 /*break*/, 8];
                    return [4 /*yield*/, getSessionKey_1.getSessionKey(program, logger, alksAccount, alksRole, false, forceNewSession, filterFaves)];
                case 7:
                    key = _a.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, getIamKey_1.getIamKey(program, logger, alksAccount, alksRole, forceNewSession, filterFaves)];
                case 9:
                    key = _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_2 = _a.sent();
                    return [2 /*return*/, errorAndExit_1.errorAndExit(err_2)];
                case 12:
                    console.log(getKeyOutput_1.getKeyOutput(output || developer.outputFormat, key, options.namedProfile, options.force));
                    log_1.log(program, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, tractActivity_1.trackActivity(logger)];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 16];
                case 15:
                    err_3 = _a.sent();
                    errorAndExit_1.errorAndExit(err_3.message, err_3);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksSessionsOpen = handleAlksSessionsOpen;
//# sourceMappingURL=alks-sessions-open.js.map