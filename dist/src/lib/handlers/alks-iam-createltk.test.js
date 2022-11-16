"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
var alks_iam_createltk_1 = require("./alks-iam-createltk");
var tryToExtractRole_1 = require("../tryToExtractRole");
var getAwsAccountFromString_1 = require("../getAwsAccountFromString");
jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../getAlks');
jest.mock('../getAuth');
jest.mock('alks.js');
jest.mock('../promptForAlksAccountAndRole');
jest.mock('../tryToExtractRole');
jest.mock('../getAwsAccountFromString');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(function () { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(function () { });
describe('handleAlksIamCreateLtk', function () {
    var defaultTestCase = {
        options: {},
        alksAccount: '',
        alksRole: '',
        shouldErr: false,
        checkForUpdateFails: false,
        shouldCreateLTK: true,
        extractedRole: '',
        createLTKParams: {
            account: '',
            role: '',
            iamUserName: '',
            tags: undefined,
        },
        createLTKOutputParams: {
            accessKey: 'defaultAccessKey',
            secretKey: 'defaultSecretKey',
            iamUserName: 'defaultIamUserName',
            iamUserArn: 'defaultIamUserArn',
        },
        getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); },
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no tags nor empty list is provided', shouldErr: false, shouldCreateLTK: true, options: {
                account: '111111111111',
                role: 'Role',
                iamusername: 'goodIamUserName',
            }, createLTKParams: {
                account: '111111111111',
                role: 'Role',
                iamUserName: 'goodIamUserName',
            }, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            id: '111111111111',
                            alias: 'awsone',
                            label: 'One - Prod',
                        })];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when empty list of tags is supplied', shouldErr: false, options: {
                account: '111111111111',
                role: 'Role',
                iamusername: 'goodIamUserName',
                tags: [],
            }, createLTKParams: {
                account: '111111111111',
                role: 'Role',
                iamUserName: 'goodIamUserName',
                tags: [],
            }, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            id: '111111111111',
                            alias: 'awsone',
                            label: 'One - Prod',
                        })];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no username is supplied', shouldErr: true, shouldCreateLTK: false, options: {
                account: '111111111111',
                role: 'AlksRole',
                tags: [],
            }, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            id: '111111111111',
                            alias: 'awsone',
                            label: 'One - Prod',
                        })];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'When good data is supplied', shouldErr: false, options: {
                account: '111111111111',
                role: 'Role',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            }, createLTKParams: {
                account: '111111111111',
                role: 'Role',
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
            }, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            id: '111111111111',
                            alias: 'awsone',
                            label: 'One - Prod',
                        })];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'When Account has role and no role supplied', shouldErr: false, alksAccount: '111111111111/ALKSRole', alksRole: 'Role', options: {
                account: '111111111111/AlksRole',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            }, createLTKParams: {
                account: '111111111111',
                role: 'Role',
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
            }, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            id: '111111111111',
                            alias: 'awsone',
                            label: 'One - Prod',
                        })];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'When account is supplied with accountID and roleName', shouldErr: false, extractedRole: 'Role', options: {
                account: '111111111112/ALKSRole',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            }, createLTKParams: {
                account: '111111111112',
                role: 'Role',
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
            }, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            id: '111111111112',
                            alias: 'awstwo',
                            label: 'Two - Prod',
                        })];
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'When no matching account is found', shouldErr: true, extractedRole: 'Role', options: {
                account: '111111111112/ALKSRole',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            }, shouldCreateLTK: false, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, undefined];
            }); }); } }),
    ];
    var fakeErrorSymbol = Symbol();
    var mockAlks = {
        createAccessKeys: jest.fn(),
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
                            tryToExtractRole_1.tryToExtractRole.mockImplementation(function () {
                                return t.extractedRole;
                            });
                            promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockImplementation(function () {
                                console.log('Prompting for alks account and role???');
                                return {
                                    alksAccount: t.alksAccount,
                                    alksRole: t.alksRole,
                                };
                            });
                            getAuth_1.getAuth.mockImplementation(function () {
                                return { accessToken: 'token' };
                            });
                            getAlks_1.getAlks.mockImplementation(function () {
                                return mockAlks;
                            });
                            mockAlks.createAccessKeys.mockImplementation(function () {
                                return t.createLTKOutputParams;
                            });
                            getAwsAccountFromString_1.getAwsAccountFromString.mockImplementation(t.getAwsAccountFromString);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, alks_iam_createltk_1.handleAlksIamCreateLtk)(t.options)];
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
            afterEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    checkForUpdate_1.checkForUpdate.mockReset();
                    errorAndExit_1.errorAndExit.mockReset();
                    promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockReset();
                    getAuth_1.getAuth.mockReset();
                    getAlks_1.getAlks.mockReset();
                    mockAlks.createAccessKeys.mockReset();
                    tryToExtractRole_1.tryToExtractRole.mockReset();
                    getAwsAccountFromString_1.getAwsAccountFromString.mockReset();
                    return [2 /*return*/];
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
            if (t.shouldCreateLTK) {
                it('creates IAM User', function () {
                    expect(mockAlks.createAccessKeys).toHaveBeenCalledWith(t.createLTKParams);
                });
            }
            else {
                it('does not create ltk', function () {
                    expect(mockAlks.createAccessKeys).not.toHaveBeenCalled();
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=alks-iam-createltk.test.js.map