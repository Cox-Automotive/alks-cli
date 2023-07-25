"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var log_1 = require("../log");
var unpackTags_1 = require("../unpackTags");
var extractAccountAndRole_1 = require("../extractAccountAndRole");
var alks_iam_updaterole_1 = require("./alks-iam-updaterole");
jest.mock('../errorAndExit', function () { return ({
    __esModule: true,
    errorAndExit: jest.fn(),
}); });
jest.mock('../checkForUpdate', function () { return ({
    __esModule: true,
    checkForUpdate: jest.fn(),
}); });
jest.mock('../getAuth', function () { return ({
    __esModule: true,
    getAuth: jest.fn(),
}); });
jest.mock('../getAlks', function () { return ({
    __esModule: true,
    getAlks: jest.fn(),
}); });
jest.mock('../log', function () { return ({
    __esModule: true,
    log: jest.fn(),
}); });
jest.mock('../unpackTags', function () { return ({
    __esModule: true,
    unpackTags: jest.fn(),
}); });
jest.mock('../extractAccountAndRole', function () { return ({
    __esModule: true,
    extractAccountAndRole: jest.fn(),
}); });
describe('handleAlksIamUpdateRole', function () {
    var mockAlks = {
        updateRole: jest.fn(),
    };
    var testCaseDefaults = {
        shouldExitWithFailure: false,
        errorAndExit: jest.fn(function () {
            throw new Error('exit');
        }),
        unpackTags: jest.fn(),
        extractAccountAndRole: jest.fn(),
        getAuth: jest.fn(),
        updateRole: jest.fn(),
        log: jest.fn(),
        checkForUpdate: jest.fn(),
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when all necessary fields as well as a trust policy and tags are provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
                tags: ['key=value'],
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                trustPolicy: {},
                tags: [
                    {
                        key: 'key',
                        value: 'value',
                    },
                ],
            }, unpackTags: function (tags) {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when all necessary fields and a trust policy but no tags are provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                trustPolicy: {},
            }, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when all necessary fields as well as tags but no trust policy is provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                tags: ['key=value'],
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                tags: [
                    {
                        key: 'key',
                        value: 'value',
                    },
                ],
            }, unpackTags: function (tags) {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when all necessary fields but no trust policy or tags are provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
            }, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when no role name is provided', options: {
                account: '012345678910',
                role: 'Admin',
            }, shouldExitWithFailure: true, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when an invalid trust policy is provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{thisisnotvalidJSON',
            }, shouldExitWithFailure: true, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when no auth is found', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
                tags: ['key=value'],
            }, shouldExitWithFailure: true, unpackTags: function (tags) {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw new Error('no auth');
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when the alks sdk fails to update the role', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
                tags: ['key=value'],
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                trustPolicy: {},
                tags: [
                    {
                        key: 'key',
                        value: 'value',
                    },
                ],
            }, shouldExitWithFailure: true, unpackTags: function (tags) {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: function (_a) {
                var account = _a.account, role = _a.role;
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_b) {
                        if (account === '012345678910' && role === 'Admin') {
                            return [2 /*return*/, {
                                    awsAccount: {
                                        id: '012345678910',
                                        alias: 'awstest123',
                                        label: 'Test 123 - Prod',
                                    },
                                    role: 'Admin',
                                }];
                        }
                        throw new Error('failed to extract account and role');
                    });
                });
            }, getAuth: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); }, updateRole: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw new Error('error updating role');
                });
            }); } }),
    ];
    var _loop_1 = function (t) {
        describe(t.description, function () {
            beforeEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            errorAndExit_1.errorAndExit.mockImplementation(t.errorAndExit);
                            unpackTags_1.unpackTags.mockImplementation(t.unpackTags);
                            extractAccountAndRole_1.extractAccountAndRole.mockImplementation(t.extractAccountAndRole);
                            getAuth_1.getAuth.mockImplementation(t.getAuth);
                            getAlks_1.getAlks.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, mockAlks];
                            }); }); });
                            mockAlks.updateRole.mockImplementation(t.updateRole);
                            log_1.log.mockImplementation(t.log);
                            checkForUpdate_1.checkForUpdate.mockImplementation(t.checkForUpdate);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, alks_iam_updaterole_1.handleAlksIamUpdateRole)(t.options)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            afterEach(function () {
                errorAndExit_1.errorAndExit.mockReset();
                unpackTags_1.unpackTags.mockReset();
                extractAccountAndRole_1.extractAccountAndRole.mockReset();
                getAuth_1.getAuth.mockReset();
                getAlks_1.getAlks.mockReset();
                log_1.log.mockReset();
                checkForUpdate_1.checkForUpdate.mockReset();
            });
            if (t.shouldExitWithFailure) {
                it('exits early with an error', function () {
                    expect(errorAndExit_1.errorAndExit).toBeCalled();
                });
            }
            else {
                it('should execute without error', function () {
                    expect(errorAndExit_1.errorAndExit).not.toHaveBeenCalled();
                });
                it('should call alks.updateRole with the correct parameters', function () {
                    expect(mockAlks.updateRole).toHaveBeenCalledWith(t.updateRoleParameters);
                });
                it('should check for updates', function () {
                    expect(checkForUpdate_1.checkForUpdate).toHaveBeenCalled();
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=alks-iam-updaterole.test.js.map