"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ensureConfigured_1 = require("./ensureConfigured");
var getAlks_1 = require("./getAlks");
var promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
var getAuth_1 = require("./getAuth");
var getIamKey_1 = require("./getIamKey");
var getKeys_1 = require("./getKeys");
var log_1 = require("./log");
var getBadAccountMessage_1 = require("./getBadAccountMessage");
var addKey_1 = require("./addKey");
var moment_1 = tslib_1.__importDefault(require("moment"));
jest.mock('./ensureConfigured');
jest.mock('./getAuth');
jest.mock('./promptForAlksAccountAndRole');
jest.mock('./log');
jest.mock('./getKeys');
jest.mock('./getAlks');
jest.mock('./getBadAccountMessage');
jest.mock('./addKey');
jest.mock('moment');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(function () { });
var date = new Date();
var defaultAccount = '012345678910/ALKSAdmin - awstest';
var defaultRole = 'Admin';
var passedAccount = '999888777666/ALKSReadOnly - awsother';
var passedRole = 'ReadOnly';
var selectedAccount = '444455556666/ALKSPowerUser - awsthing';
var selectedRole = 'PowerUser';
describe('getIamKey', function () {
    var defaultTestCase = {
        program: {},
        alksAccount: passedAccount,
        alksRole: passedRole,
        forceNewSession: false,
        filterFavorites: false,
        result: {
            alksAccount: passedAccount,
            alksRole: passedRole,
            isIAM: true,
            accessKey: 'abcd',
            secretKey: 'efgh',
            sessionToken: 'ijkl',
            expires: date,
        },
        shouldThrow: false,
        shouldGetAlksAccount: false,
        shouldSaveKey: false,
        ensureConfigured: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({
                        token: 'thisisatoken',
                    })];
            });
        }); },
        getAlksAccount: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({
                        alksAccount: selectedAccount,
                        alksRole: selectedRole,
                    })];
            });
        }); },
        log: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        getKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, []];
        }); }); },
        getAlks: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({
                        getLoginRole: function (_a) {
                            var accountId = _a.accountId, role = _a.role;
                            return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_b) {
                                    return [2 /*return*/, ({
                                            account: accountId + "/ALKS" + role,
                                            role: role,
                                            iamKeyActive: true,
                                            maxKeyDuration: 12,
                                            skypieaAccount: null,
                                        })];
                                });
                            });
                        },
                        getIAMKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        accessKey: 'abcd',
                                        secretKey: 'efgh',
                                        sessionToken: 'ijkl',
                                        consoleURL: 'https://login.aws.com/my-account',
                                    })];
                            });
                        }); },
                    })];
            });
        }); },
        getBadAccountMessage: function () { return 'Bad Account'; },
        addKey: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when not configured', shouldThrow: true, ensureConfigured: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw new Error();
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no keys exist', shouldSaveKey: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when forceNewSession is true', forceNewSession: true, shouldSaveKey: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an existing session exists', getKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, [
                            {
                                alksAccount: passedAccount,
                                alksRole: passedRole,
                                isIAM: true,
                                expires: date,
                                accessKey: 'oooo',
                                secretKey: 'ohhh',
                                sessionToken: 'ahhh',
                                $loki: 0,
                                meta: {
                                    created: 1,
                                    revision: 2,
                                    updated: 3,
                                    version: 4,
                                },
                            },
                        ]];
                });
            }); }, result: tslib_1.__assign(tslib_1.__assign({}, defaultTestCase.result), { accessKey: 'oooo', secretKey: 'ohhh', sessionToken: 'ahhh' }) }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an existing session exists but forceNewSession is true', forceNewSession: true, shouldSaveKey: true, getKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, [
                            {
                                alksAccount: passedAccount,
                                alksRole: passedRole,
                                isIAM: true,
                                expires: date,
                                accessKey: 'oooo',
                                secretKey: 'ohhh',
                                sessionToken: 'ahhh',
                                $loki: 0,
                                meta: {
                                    created: 1,
                                    revision: 2,
                                    updated: 3,
                                    version: 4,
                                },
                            },
                        ]];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an existing session exists for the wrong account', shouldSaveKey: true, getKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, [
                            {
                                alksAccount: defaultAccount,
                                alksRole: defaultRole,
                                isIAM: true,
                                expires: date,
                                accessKey: 'oooo',
                                secretKey: 'ohhh',
                                sessionToken: 'ahhh',
                                $loki: 0,
                                meta: {
                                    created: 1,
                                    revision: 2,
                                    updated: 3,
                                    version: 4,
                                },
                            },
                        ]];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when multiple existing sessions exist', getKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, [
                            {
                                alksAccount: passedAccount,
                                alksRole: passedRole,
                                isIAM: true,
                                expires: date,
                                accessKey: 'oooo',
                                secretKey: 'ohhh',
                                sessionToken: 'ahhh',
                                $loki: 0,
                                meta: {
                                    created: 1,
                                    revision: 2,
                                    updated: 3,
                                    version: 4,
                                },
                            },
                            {
                                alksAccount: passedAccount,
                                alksRole: passedRole,
                                isIAM: true,
                                expires: new Date(date.getTime() + 1),
                                accessKey: 'zoo',
                                secretKey: 'zaz',
                                sessionToken: 'zba',
                                $loki: 0,
                                meta: {
                                    created: 1,
                                    revision: 2,
                                    updated: 3,
                                    version: 4,
                                },
                            },
                        ]];
                });
            }); }, result: tslib_1.__assign(tslib_1.__assign({}, defaultTestCase.result), { accessKey: 'zoo', secretKey: 'zaz', sessionToken: 'zba', expires: new Date(date.getTime() + 1) }) }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no account or role is passed', shouldSaveKey: true, shouldGetAlksAccount: true, alksAccount: undefined, alksRole: undefined, result: tslib_1.__assign(tslib_1.__assign({}, defaultTestCase.result), { alksAccount: selectedAccount, alksRole: selectedRole }) }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getting existing keys fails', getKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw new Error();
                });
            }); }, shouldThrow: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when alks.getLoginRole fails', getAlks: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            getLoginRole: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    throw new Error();
                                });
                            }); },
                            getIAMKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, defaultTestCase.getAlks({})];
                                        case 1: return [2 /*return*/, (_a.sent()).getIAMKeys({})];
                                    }
                                });
                            }); },
                        })];
                });
            }); }, shouldThrow: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when alks.getIAMKeys fails', getAlks: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            getLoginRole: function (props) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, defaultTestCase.getAlks({})];
                                        case 1: return [2 /*return*/, (_a.sent()).getLoginRole(props)];
                                    }
                                });
                            }); },
                            getIAMKeys: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    throw new Error();
                                });
                            }); },
                        })];
                });
            }); }, shouldThrow: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when saving the key fails', addKey: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw new Error();
                });
            }); }, shouldSaveKey: true, shouldThrow: true }),
    ];
    var _loop_1 = function (t) {
        describe(t.description, function () {
            var result;
            var errorThrown = false;
            beforeEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var err_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ensureConfigured_1.ensureConfigured.mockImplementation(t.ensureConfigured);
                            getAuth_1.getAuth.mockImplementation(t.getAuth);
                            promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockImplementation(t.getAlksAccount);
                            log_1.log.mockImplementation(t.log);
                            getKeys_1.getKeys.mockImplementation(t.getKeys);
                            getAlks_1.getAlks.mockImplementation(t.getAlks);
                            getBadAccountMessage_1.getBadAccountMessage.mockImplementation(t.getBadAccountMessage);
                            addKey_1.addKey.mockImplementation(t.addKey);
                            moment_1.default.mockImplementation(function () {
                                var moment = {};
                                moment.add = function () { return moment; };
                                moment.toDate = function () { return date; };
                                return moment;
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getIamKey_1.getIamKey(t.alksAccount, t.alksRole, t.forceNewSession, t.filterFavorites)];
                        case 2:
                            result = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            console.error(err_1);
                            errorThrown = true;
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            if (t.shouldThrow) {
                it('rejects with an error', function () {
                    expect(errorThrown).toBe(true);
                });
            }
            else {
                it('resolves with the correct key', function () {
                    expect(result).toEqual(expect.objectContaining(t.result));
                });
            }
            if (t.shouldGetAlksAccount) {
                it('calls promptForAlksAccountAndRole to ask for an ALKS account and role', function () {
                    expect(promptForAlksAccountAndRole_1.promptForAlksAccountAndRole).toHaveBeenCalledWith({
                        iamOnly: true,
                        filterFavorites: t.filterFavorites,
                    });
                });
            }
            else {
                it('does not call getAlksAccount', function () {
                    expect(promptForAlksAccountAndRole_1.promptForAlksAccountAndRole).not.toHaveBeenCalled();
                });
            }
            if (t.shouldSaveKey) {
                it('saves the key for later use', function () {
                    expect(addKey_1.addKey).toHaveBeenCalledWith(t.result.accessKey, t.result.secretKey, t.result.sessionToken, t.result.alksAccount, t.result.alksRole, t.result.expires, expect.any(Object), t.result.isIAM);
                });
            }
            else {
                it('does not save the key for later use', function () {
                    expect(addKey_1.addKey).not.toHaveBeenCalled();
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=getIamKey.test.js.map