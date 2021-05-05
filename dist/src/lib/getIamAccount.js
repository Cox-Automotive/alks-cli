"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIAMAccount = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var ensureConfigured_1 = require("./ensureConfigured");
var getAlksAccount_1 = require("./getAlksAccount");
var getAuth_1 = require("./getAuth");
var getDeveloper_1 = require("./getDeveloper");
var log_1 = require("./log");
function getIAMAccount(program, alksAccount, alksRole, filterFavorites) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, auth;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureConfigured_1.ensureConfigured()];
                case 1:
                    _b.sent();
                    log_1.log('getting developer');
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 2:
                    developer = _b.sent();
                    log_1.log('getting auth');
                    return [4 /*yield*/, getAuth_1.getAuth(program)];
                case 3:
                    auth = _b.sent();
                    if (!(underscore_1.isEmpty(alksAccount) || underscore_1.isEmpty(alksRole))) return [3 /*break*/, 5];
                    log_1.log('getting accounts');
                    return [4 /*yield*/, getAlksAccount_1.getAlksAccount(program, {
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 4:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 6];
                case 5:
                    log_1.log('using provided account/role' + alksAccount + ' ' + alksRole);
                    _b.label = 6;
                case 6: return [2 /*return*/, {
                        developer: developer,
                        auth: auth,
                        account: alksAccount,
                        role: alksRole,
                    }];
            }
        });
    });
}
exports.getIAMAccount = getIAMAccount;
//# sourceMappingURL=getIamAccount.js.map