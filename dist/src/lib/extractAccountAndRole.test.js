"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var extractAccountAndRole_1 = require("./extractAccountAndRole");
var log_1 = require("./log");
var tryToExtractRole_1 = require("./tryToExtractRole");
var promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
var getAwsAccountFromString_1 = require("./getAwsAccountFromString");
jest.mock('./log', function () { return ({
    __esModule: true,
    log: jest.fn(),
}); });
jest.mock('./tryToExtractRole', function () { return ({
    __esModule: true,
    tryToExtractRole: jest.fn(),
}); });
jest.mock('./promptForAlksAccountAndRole', function () { return ({
    __esModule: true,
    promptForAlksAccountAndRole: jest.fn(),
}); });
jest.mock('./getAwsAccountFromString', function () { return ({
    __esModule: true,
    getAwsAccountFromString: jest.fn(),
}); });
describe('extractAccountAndRole', function () {
    var testCaseDefaults = {
        shouldThrow: false,
        log: jest.fn(),
        tryToExtractRole: jest.fn(),
        promptForAlksAccountAndRole: jest.fn(),
        getAwsAccountFromString: jest.fn(),
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when an account and role are provided', options: {
                account: '012345678910',
                role: 'Admin',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', getAwsAccountFromString: function (account) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (account === '012345678910') {
                        return [2 /*return*/, {
                                id: '012345678910',
                                alias: 'awstest123',
                                label: 'Test 123 - Prod',
                            }];
                    }
                    throw new Error('no account found');
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when an account and role are provided but no matching account is found', options: {
                account: '012345678910',
                role: 'Admin',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', shouldThrow: true, getAwsAccountFromString: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    throw new Error('invalid account');
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when only an account string is provided containing the role in the string', options: {
                account: '012345678910/ALKSAdmin',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', tryToExtractRole: function (account) {
                if (account === '012345678910/ALKSAdmin') {
                    return 'Admin';
                }
                throw new Error('no role found');
            }, getAwsAccountFromString: function (account) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (account === '012345678910/ALKSAdmin') {
                        return [2 /*return*/, {
                                id: '012345678910',
                                alias: 'awstest123',
                                label: 'Test 123 - Prod',
                            }];
                    }
                    throw new Error('no account found');
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when only an account id is provided', options: {
                account: '012345678910',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', tryToExtractRole: function () { return undefined; }, promptForAlksAccountAndRole: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            alksAccount: '012345678910',
                            alksRole: 'Admin',
                        })];
                });
            }); }, getAwsAccountFromString: function (account) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (account === '012345678910') {
                        return [2 /*return*/, {
                                id: '012345678910',
                                alias: 'awstest123',
                                label: 'Test 123 - Prod',
                            }];
                    }
                    throw new Error('no account found');
                });
            }); } }),
        tslib_1.__assign(tslib_1.__assign({}, testCaseDefaults), { description: 'when no account or role are provided', options: {}, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', promptForAlksAccountAndRole: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, ({
                            alksAccount: '012345678910',
                            alksRole: 'Admin',
                        })];
                });
            }); }, getAwsAccountFromString: function (account) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (account === '012345678910') {
                        return [2 /*return*/, {
                                id: '012345678910',
                                alias: 'awstest123',
                                label: 'Test 123 - Prod',
                            }];
                    }
                    throw new Error('no account found');
                });
            }); } }),
    ];
    var _loop_1 = function (t) {
        describe(t.description, function () {
            var result;
            var exception;
            beforeEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var e_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log_1.log.mockImplementation(t.log);
                            tryToExtractRole_1.tryToExtractRole.mockImplementation(t.tryToExtractRole);
                            promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockImplementation(t.promptForAlksAccountAndRole);
                            getAwsAccountFromString_1.getAwsAccountFromString.mockImplementation(t.getAwsAccountFromString);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, extractAccountAndRole_1.extractAccountAndRole)(t.options)];
                        case 2:
                            result = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            exception = e_1;
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            afterEach(function () {
                log_1.log.mockReset();
                tryToExtractRole_1.tryToExtractRole.mockReset();
                promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockReset();
                getAwsAccountFromString_1.getAwsAccountFromString.mockReset();
            });
            if (t.shouldThrow) {
                it('throws an exception', function () {
                    expect(exception).toBeInstanceOf(Error);
                });
            }
            else {
                it('returns the correct result', function () {
                    expect(result.awsAccount).toEqual(t.resultAccount);
                    expect(result.role).toEqual(t.resultRole);
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=extractAccountAndRole.test.js.map