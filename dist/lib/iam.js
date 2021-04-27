"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIAMAccount = exports.getIAMKey = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var underscore_1 = require("underscore");
var alks_1 = require("./alks");
var developer_1 = require("./developer");
var keys_1 = require("./keys");
var utils_1 = require("./utils");
var moment_1 = tslib_1.__importDefault(require("moment"));
function getIAMKey(program, logger, alksAccount, alksRole, forceNewSession, filterFavorites) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, auth, existingKeys, keyCriteria, selectedKey, alks, loginRole, duration, alksKey, e_1, key;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, developer_1.ensureConfigured()];
                case 1:
                    _b.sent();
                    utils_1.log(program, logger, 'getting developer');
                    return [4 /*yield*/, developer_1.getDeveloper()];
                case 2:
                    developer = _b.sent();
                    utils_1.log(program, logger, 'getting auth');
                    return [4 /*yield*/, developer_1.getAuth(program)];
                case 3:
                    auth = _b.sent();
                    if (!(underscore_1.isEmpty(alksAccount) || underscore_1.isEmpty(alksRole))) return [3 /*break*/, 5];
                    utils_1.log(program, logger, 'getting accounts');
                    return [4 /*yield*/, developer_1.getAlksAccount(program, {
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 4:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 6];
                case 5:
                    utils_1.log(program, logger, 'using provided account/role');
                    _b.label = 6;
                case 6:
                    utils_1.log(program, logger, 'getting existing keys');
                    return [4 /*yield*/, keys_1.getKeys(auth, true)];
                case 7:
                    existingKeys = _b.sent();
                    utils_1.log(program, logger, 'got existing keys');
                    if (existingKeys.length && !forceNewSession) {
                        utils_1.log(program, logger, 'filtering keys by account/role - ' + alksAccount + ' - ' + alksRole);
                        keyCriteria = { alksAccount: alksAccount, alksRole: alksRole };
                        selectedKey = underscore_1.last(underscore_1.sortBy(underscore_1.where(existingKeys, keyCriteria), 'expires'));
                        if (selectedKey) {
                            utils_1.log(program, logger, 'found existing valid key');
                            console.error(cli_color_1.white.underline(['Resuming existing session in', alksAccount, alksRole].join(' ')));
                            return [2 /*return*/, selectedKey];
                        }
                    }
                    // generate a new key/session
                    if (forceNewSession) {
                        utils_1.log(program, logger, 'forcing a new session');
                    }
                    return [4 /*yield*/, alks_1.getAlks(tslib_1.__assign({ baseUrl: developer.server }, auth))];
                case 8:
                    alks = _b.sent();
                    return [4 /*yield*/, alks.getLoginRole({
                            accountId: alksAccount.slice(0, 12),
                            role: alksRole,
                        })];
                case 9:
                    loginRole = _b.sent();
                    duration = Math.min(loginRole.maxKeyDuration, 12);
                    console.error(cli_color_1.white.underline(['Creating new session in', alksAccount, alksRole].join(' ')));
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, alks.getIAMKeys({
                            account: alksAccount,
                            role: alksRole,
                            sessionTime: duration,
                        })];
                case 11:
                    alksKey = _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    e_1 = _b.sent();
                    throw new Error(utils_1.getBadAccountMessage());
                case 13:
                    key = tslib_1.__assign(tslib_1.__assign({}, alksKey), { expires: moment_1.default().add(duration, 'hours').toDate(), alksAccount: alksAccount,
                        alksRole: alksRole, isIAM: true });
                    utils_1.log(program, logger, 'storing key: ' + JSON.stringify(key));
                    keys_1.addKey(key.accessKey, key.secretKey, key.sessionToken, alksAccount, alksRole, key.expires, auth, true);
                    return [2 /*return*/, key];
            }
        });
    });
}
exports.getIAMKey = getIAMKey;
function getIAMAccount(program, logger, alksAccount, alksRole, filterFavorites) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, auth;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, developer_1.ensureConfigured()];
                case 1:
                    _b.sent();
                    utils_1.log(program, logger, 'getting developer');
                    return [4 /*yield*/, developer_1.getDeveloper()];
                case 2:
                    developer = _b.sent();
                    utils_1.log(program, logger, 'getting auth');
                    return [4 /*yield*/, developer_1.getAuth(program)];
                case 3:
                    auth = _b.sent();
                    if (!(underscore_1.isEmpty(alksAccount) || underscore_1.isEmpty(alksRole))) return [3 /*break*/, 5];
                    utils_1.log(program, logger, 'getting accounts');
                    return [4 /*yield*/, developer_1.getAlksAccount(program, {
                            iamOnly: true,
                            filterFavorites: filterFavorites,
                        })];
                case 4:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 6];
                case 5:
                    utils_1.log(program, logger, 'using provided account/role' + alksAccount + ' ' + alksRole);
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
//# sourceMappingURL=iam.js.map