"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAccountAndRole = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var log_1 = require("./log");
var tryToExtractRole_1 = require("./tryToExtractRole");
var promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
var getAwsAccountFromString_1 = require("./getAwsAccountFromString");
var badAccountMessage_1 = require("./badAccountMessage");
/**
 * Gets an AwsAccount object and a role name from the provided options. If options are missing, it asks the user to select them
 *
 * @param options - the commander options object
 * @returns an account and role pair
 */
function extractAccountAndRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccount, alksRole, filterFavorites, awsAccount;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    alksAccount = options.account;
                    alksRole = options.role;
                    filterFavorites = options.favorites || false;
                    if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
                        (0, log_1.log)('trying to extract role from account');
                        alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
                    }
                    if (!(!alksAccount || !alksRole)) return [3 /*break*/, 2];
                    (0, log_1.log)('getting accounts');
                    return [4 /*yield*/, (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 1:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 3];
                case 2:
                    (0, log_1.log)('using provided account/role');
                    _b.label = 3;
                case 3: return [4 /*yield*/, (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount)];
                case 4:
                    awsAccount = _b.sent();
                    if (!awsAccount) {
                        throw new Error(badAccountMessage_1.badAccountMessage);
                    }
                    return [2 /*return*/, {
                            awsAccount: awsAccount,
                            role: alksRole,
                        }];
            }
        });
    });
}
exports.extractAccountAndRole = extractAccountAndRole;
//# sourceMappingURL=extractAccountAndRole.js.map