"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsOpen = void 0;
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getIamKey_1 = require("../getIamKey");
var getKeyOutput_1 = require("../getKeyOutput");
var log_1 = require("../log");
var tryToExtractRole_1 = require("../tryToExtractRole");
var alksAccount_1 = require("../state/alksAccount");
var alksRole_1 = require("../state/alksRole");
var outputFormat_1 = require("../state/outputFormat");
function handleAlksSessionsOpen(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccount, alksRole, key, _a, _b, _c, _d, err_1;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    alksAccount = options.account;
                    alksRole = options.role;
                    // Try to guess role from account if only account was provided
                    if (alksAccount && !alksRole) {
                        (0, log_1.log)('trying to extract role from account');
                        alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 9, , 10]);
                    if (!options.default) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, alksAccount_1.getAlksAccount)()];
                case 2:
                    alksAccount = _e.sent();
                    return [4 /*yield*/, (0, alksRole_1.getAlksRole)()];
                case 3:
                    alksRole = _e.sent();
                    if (!alksAccount || !alksRole) {
                        (0, errorAndExit_1.errorAndExit)('Unable to load default account!');
                    }
                    _e.label = 4;
                case 4: return [4 /*yield*/, (0, getIamKey_1.getIamKey)(alksAccount, alksRole, options.newSession, options.favorites, !!options.iam)];
                case 5:
                    key = _e.sent();
                    _b = (_a = console).log;
                    _c = getKeyOutput_1.getKeyOutput;
                    _d = options.output;
                    if (_d) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, outputFormat_1.getOutputFormat)()];
                case 6:
                    _d = (_e.sent());
                    _e.label = 7;
                case 7:
                    _b.apply(_a, [_c.apply(void 0, [_d, key,
                            options.namedProfile,
                            options.force])]);
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 8:
                    _e.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _e.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1.message, err_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksSessionsOpen = handleAlksSessionsOpen;
//# sourceMappingURL=alks-sessions-open.js.map