"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsOpen = void 0;
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getDeveloper_1 = require("../getDeveloper");
var getIamKey_1 = require("../getIamKey");
var getKeyOutput_1 = require("../getKeyOutput");
var getSessionKey_1 = require("../getSessionKey");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksSessionsOpen(options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccount, alksRole, logger, developer, err_1, key, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    alksAccount = options.account;
                    alksRole = options.role;
                    logger = 'sessions-open';
                    // Try to guess role from account if only account was provided
                    if (alksAccount && !alksRole) {
                        log_1.log(program, logger, 'trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 13]);
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
                    if (options.default) {
                        alksAccount = developer.alksAccount;
                        alksRole = developer.alksRole;
                    }
                    key = void 0;
                    if (!options.iam) return [3 /*break*/, 7];
                    return [4 /*yield*/, getIamKey_1.getIamKey(program, logger, alksAccount, alksRole, options.newSession, options.favorites)];
                case 6:
                    key = _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, getSessionKey_1.getSessionKey(program, logger, alksAccount, alksRole, false, options.newSession, options.favorites)];
                case 8:
                    key = _a.sent();
                    _a.label = 9;
                case 9:
                    console.log(getKeyOutput_1.getKeyOutput(options.output || developer.outputFormat, key, options.namedProfile, options.force));
                    log_1.log(program, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity(logger)];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_2 = _a.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksSessionsOpen = handleAlksSessionsOpen;
//# sourceMappingURL=alks-sessions-open.js.map