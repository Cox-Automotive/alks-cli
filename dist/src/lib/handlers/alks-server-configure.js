"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerConfigure = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getIamKey_1 = require("../getIamKey");
var log_1 = require("../log");
var saveMetadata_1 = require("../saveMetadata");
var tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksServerConfigure(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccount, alksRole, forceNewSession, filterFaves, key, err_1, err_2, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    alksAccount = options.account;
                    alksRole = options.role;
                    forceNewSession = options.newSession;
                    filterFaves = options.favorites || false;
                    if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
                        (0, log_1.log)('trying to extract role from account');
                        alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 13]);
                    key = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, getIamKey_1.getIamKey)(alksAccount, alksRole, forceNewSession, filterFaves, (0, underscore_1.isUndefined)(options.iam) ? false : true)];
                case 3:
                    key = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, (0, saveMetadata_1.saveMetadata)({
                            alksAccount: key.alksAccount,
                            alksRole: key.alksRole,
                            isIam: key.isIAM,
                        })];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)('Unable to save metadata!', err_2);
                    return [3 /*break*/, 10];
                case 10:
                    console.error(cli_color_1.default.white('Metadata has been saved!'));
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_3 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_3.message, err_3);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksServerConfigure = handleAlksServerConfigure;
//# sourceMappingURL=alks-server-configure.js.map