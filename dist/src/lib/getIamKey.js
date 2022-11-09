"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIamKey = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var underscore_1 = require("underscore");
var getAlks_1 = require("./getAlks");
var moment_1 = tslib_1.__importDefault(require("moment"));
var log_1 = require("./log");
var badAccountMessage_1 = require("./badAccountMessage");
var ensureConfigured_1 = require("./ensureConfigured");
var getAuth_1 = require("./getAuth");
var promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
var getKeys_1 = require("./getKeys");
var addKey_1 = require("./addKey");
var getAwsAccountFromString_1 = require("./getAwsAccountFromString");
function getIamKey(alksAccount, alksRole, forceNewSession, filterFavorites, iamOnly) {
    var _a, _b;
    if (forceNewSession === void 0) { forceNewSession = false; }
    if (filterFavorites === void 0) { filterFavorites = false; }
    if (iamOnly === void 0) { iamOnly = true; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var auth, awsAccount, existingKeys, keyCriteria, selectedKey, alks, loginRole, duration, alksKey, e_1, key;
        var _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, ensureConfigured_1.ensureConfigured)()];
                case 1:
                    _d.sent();
                    (0, log_1.log)('getting auth');
                    return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 2:
                    auth = _d.sent();
                    if (!(!alksAccount || !alksRole)) return [3 /*break*/, 4];
                    (0, log_1.log)('getting accounts');
                    return [4 /*yield*/, (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                            iamOnly: iamOnly,
                            filterFavorites: filterFavorites,
                        })];
                case 3:
                    (_c = _d.sent(), alksAccount = _c.alksAccount, alksRole = _c.alksRole);
                    return [3 /*break*/, 5];
                case 4:
                    (0, log_1.log)('using provided account/role');
                    _d.label = 5;
                case 5: return [4 /*yield*/, (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount)];
                case 6:
                    awsAccount = _d.sent();
                    if (!awsAccount) {
                        throw new Error(badAccountMessage_1.badAccountMessage);
                    }
                    (0, log_1.log)('getting existing keys');
                    return [4 /*yield*/, (0, getKeys_1.getKeys)(auth, true)];
                case 7:
                    existingKeys = _d.sent();
                    (0, log_1.log)('got existing keys');
                    if (existingKeys.length && !forceNewSession) {
                        (0, log_1.log)("filtering keys by ".concat(awsAccount.id, "(").concat(awsAccount === null || awsAccount === void 0 ? void 0 : awsAccount.alias, ") with role ").concat(alksRole));
                        keyCriteria = { alksAccount: awsAccount.id, alksRole: alksRole };
                        selectedKey = (0, underscore_1.last)((0, underscore_1.sortBy)((0, underscore_1.where)(existingKeys, keyCriteria), 'expires'));
                        if (selectedKey) {
                            (0, log_1.log)('found existing valid key');
                            console.error(cli_color_1.white.underline("Resuming existing session in \"".concat((_a = awsAccount.label) !== null && _a !== void 0 ? _a : awsAccount.alias, "\" (id=").concat(awsAccount.id, " alias=").concat(awsAccount.alias, ") for ").concat(alksRole)));
                            return [2 /*return*/, selectedKey];
                        }
                    }
                    // generate a new key/session
                    if (forceNewSession) {
                        (0, log_1.log)('forcing a new session');
                    }
                    return [4 /*yield*/, (0, getAlks_1.getAlks)(tslib_1.__assign({}, auth))];
                case 8:
                    alks = _d.sent();
                    return [4 /*yield*/, alks.getLoginRole({
                            accountId: awsAccount.id,
                            role: alksRole,
                        })];
                case 9:
                    loginRole = _d.sent();
                    duration = Math.min(loginRole.maxKeyDuration, 12);
                    console.error(cli_color_1.white.underline("Creating new session in \"".concat((_b = awsAccount.label) !== null && _b !== void 0 ? _b : awsAccount.alias, "\" (id=").concat(awsAccount.id, " alias=").concat(awsAccount.alias, ") for ").concat(alksRole)));
                    _d.label = 10;
                case 10:
                    _d.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, alks.getIAMKeys({
                            account: awsAccount.id,
                            role: alksRole,
                            sessionTime: duration,
                        })];
                case 11:
                    alksKey = _d.sent();
                    return [3 /*break*/, 13];
                case 12:
                    e_1 = _d.sent();
                    throw new Error(badAccountMessage_1.badAccountMessage);
                case 13:
                    key = {
                        accessKey: alksKey.accessKey,
                        secretKey: alksKey.secretKey,
                        sessionToken: alksKey.sessionToken,
                        expires: (0, moment_1.default)().add(duration, 'hours').toDate(),
                        alksAccount: awsAccount.id,
                        alksRole: alksRole,
                        isIAM: true,
                    };
                    (0, log_1.log)('storing key: ' + JSON.stringify(key), {
                        unsafe: true,
                        alt: 'storing key',
                    });
                    return [4 /*yield*/, (0, addKey_1.addKey)(key.accessKey, key.secretKey, key.sessionToken, awsAccount.id, alksRole, key.expires, auth, true)];
                case 14:
                    _d.sent();
                    return [2 /*return*/, key];
            }
        });
    });
}
exports.getIamKey = getIamKey;
//# sourceMappingURL=getIamKey.js.map