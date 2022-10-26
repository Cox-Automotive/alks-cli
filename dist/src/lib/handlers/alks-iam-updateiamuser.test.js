"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var alks_iam_updateiamuser_1 = require("./alks-iam-updateiamuser");
jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../getAlks');
jest.mock('../getAuth');
jest.mock('alks.js');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(function () { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(function () { });
describe('handleAlksIamUpdateIamUser', function () {
    var defaultTestCase = {
        options: {},
        shouldErr: false,
        checkForUpdateFails: false,
        shouldUpdateIamUser: true,
        updateIamUserParams: {
            account: '',
            iamUserName: '',
            tags: undefined,
        },
        updateIamUserOutputParams: {
            accountId: '',
            accessKey: '',
            iamUserName: '',
            iamUserArn: '',
            tags: undefined,
        },
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when bad accountId is supplied', shouldErr: true, shouldUpdateIamUser: false, options: {
                account: 'badAccountId',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no tags nor empty list is provided', shouldErr: true, shouldUpdateIamUser: false, options: {
                account: '111111111111',
                iamusername: 'goodIamUserName',
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when empty list of tags is supplied', shouldErr: false, options: {
                account: '111111111111',
                iamusername: 'goodIamUserName',
                tags: [],
            }, updateIamUserParams: {
                account: '111111111111',
                iamUserName: 'goodIamUserName',
                tags: [],
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no username is supplied', shouldErr: true, shouldUpdateIamUser: false, options: {
                account: '111111111111',
                tags: [],
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'When good data is supplied', shouldErr: false, options: {
                account: '111111111111',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            }, updateIamUserParams: {
                account: '111111111111',
                iamUserName: 'goodIamUserName',
                tags: [
                    {
                        key: 'key1',
                        value: 'val1',
                    },
                    {
                        key: 'key2',
                        value: 'val2',
                    },
                ],
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'When account is supplied with accountID and roleName', shouldErr: false, options: {
                account: '111111111111/ALKSRole',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            }, updateIamUserParams: {
                account: '111111111111',
                iamUserName: 'goodIamUserName',
                tags: [
                    {
                        key: 'key1',
                        value: 'val1',
                    },
                    {
                        key: 'key2',
                        value: 'val2',
                    },
                ],
            } }),
    ];
    var fakeErrorSymbol = Symbol();
    var mockAlks = {
        updateIamUser: jest.fn(),
    };
    var _loop_1 = function (t) {
        describe(t.description, function () {
            var errorThrown = false;
            beforeEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var e_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            checkForUpdate_1.checkForUpdate.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.checkForUpdateFails) {
                                        throw new Error();
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            errorAndExit_1.errorAndExit.mockImplementation(function () {
                                errorThrown = true;
                                throw fakeErrorSymbol;
                            });
                            getAuth_1.getAuth.mockImplementation(function () {
                                return { accessToken: 'token' };
                            });
                            getAlks_1.getAlks.mockImplementation(function () {
                                return mockAlks;
                            });
                            mockAlks.updateIamUser.mockImplementation(function () {
                                return t.updateIamUserOutputParams;
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, alks_iam_updateiamuser_1.handleAlksIamUpdateIamUser)(t.options)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            if (!(e_1 === fakeErrorSymbol)) {
                                throw e_1;
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            if (t.shouldErr) {
                it('calls errorAndExit', function () {
                    expect(errorThrown).toBe(true);
                });
            }
            else {
                it("doesn't call errorAndExit", function () {
                    expect(errorThrown).toBe(false);
                });
            }
            if (t.shouldUpdateIamUser) {
                it('updates IAM User', function () {
                    expect(mockAlks.updateIamUser).toHaveBeenCalledWith(t.updateIamUserParams);
                });
            }
            else {
                it('does not get key output', function () {
                    expect(mockAlks.updateIamUser).not.toHaveBeenCalled();
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=alks-iam-updateiamuser.test.js.map