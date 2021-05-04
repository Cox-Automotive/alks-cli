"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionKey = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var underscore_1 = require("underscore");
var getAlks_1 = require("./getAlks");
var moment_1 = tslib_1.__importDefault(require("moment"));
var log_1 = require("./log");
var getBadAccountMessage_1 = require("./getBadAccountMessage");
var ensureConfigured_1 = require("./ensureConfigured");
var getDeveloper_1 = require("./getDeveloper");
var getAuth_1 = require("./getAuth");
var getAlksAccount_1 = require("./getAlksAccount");
var getKeys_1 = require("./getKeys");
var addKey_1 = require("./addKey");
function getSessionKey(program, logger, alksAccount, alksRole, iamOnly, forceNewSession, filterFavorites) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, auth, existingKeys, keyCriteria, selectedKey, alks, loginRole, duration, alksKey, e_1, key;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureConfigured_1.ensureConfigured()];
                case 1:
                    _b.sent();
                    log_1.log(program, logger, 'getting developer');
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 2:
                    developer = _b.sent();
                    log_1.log(program, logger, 'getting auth');
                    return [4 /*yield*/, getAuth_1.getAuth(program)];
                case 3:
                    auth = _b.sent();
                    if (!(!alksAccount || !alksRole)) return [3 /*break*/, 5];
                    log_1.log(program, logger, 'getting accounts');
                    return [4 /*yield*/, getAlksAccount_1.getAlksAccount(program, {
                            iamOnly: iamOnly,
                            filterFavorites: filterFavorites,
                        })];
                case 4:
                    (_a = _b.sent(), alksAccount = _a.alksAccount, alksRole = _a.alksRole);
                    return [3 /*break*/, 6];
                case 5:
                    log_1.log(program, logger, 'using provided account/role');
                    _b.label = 6;
                case 6:
                    log_1.log(program, logger, 'getting existing keys');
                    return [4 /*yield*/, getKeys_1.getKeys(auth, false)];
                case 7:
                    existingKeys = _b.sent();
                    if (existingKeys.length && !forceNewSession) {
                        log_1.log(program, logger, 'filtering keys by account/role - ' + alksAccount + ' - ' + alksRole);
                        keyCriteria = { alksAccount: alksAccount, alksRole: alksRole };
                        selectedKey = underscore_1.last(underscore_1.sortBy(underscore_1.where(existingKeys, keyCriteria), 'expires'));
                        if (selectedKey) {
                            log_1.log(program, logger, 'found existing valid key');
                            console.error(cli_color_1.white.underline(['Resuming existing session in', alksAccount, alksRole].join(' ')));
                            return [2 /*return*/, selectedKey];
                        }
                    }
                    // generate a new key/session
                    if (forceNewSession) {
                        log_1.log(program, logger, 'forcing a new session');
                    }
                    return [4 /*yield*/, getAlks_1.getAlks(tslib_1.__assign({ baseUrl: developer.server }, auth))];
                case 8:
                    alks = _b.sent();
                    return [4 /*yield*/, alks.getLoginRole({
                            accountId: alksAccount.slice(0, 12),
                            role: alksRole,
                        })];
                case 9:
                    loginRole = _b.sent();
                    duration = Math.min(loginRole.maxKeyDuration, 12);
                    log_1.log(program, logger, 'calling api to generate new keys/session for ' + duration + ' hours');
                    console.error(cli_color_1.white.underline(['Creating new session in', alksAccount, alksRole].join(' ')));
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, alks.getKeys({
                            account: alksAccount,
                            role: alksRole,
                            sessionTime: duration,
                        })];
                case 11:
                    alksKey = _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    e_1 = _b.sent();
                    throw new Error(getBadAccountMessage_1.getBadAccountMessage());
                case 13:
                    key = tslib_1.__assign(tslib_1.__assign({}, alksKey), { expires: moment_1.default().add(duration, 'hours').toDate(), alksAccount: alksAccount,
                        alksRole: alksRole, isIAM: true });
                    log_1.log(program, logger, 'storing key: ' + JSON.stringify(key));
                    addKey_1.addKey(key.accessKey, key.secretKey, key.sessionToken, alksAccount, alksRole, key.expires, auth, true);
                    return [2 /*return*/, key];
            }
        });
    });
}
exports.getSessionKey = getSessionKey;
//# sourceMappingURL=getSessionKey.js.map