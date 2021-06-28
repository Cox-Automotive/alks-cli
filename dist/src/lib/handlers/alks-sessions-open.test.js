"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errorAndExit_1 = require("../errorAndExit");
var checkForUpdate_1 = require("../checkForUpdate");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
var getKeyOutput_1 = require("../getKeyOutput");
var getIamKey_1 = require("../getIamKey");
var getSessionKey_1 = require("../getSessionKey");
var alks_sessions_open_1 = require("./alks-sessions-open");
var alksAccount_1 = require("../state/alksAccount");
var alksRole_1 = require("../state/alksRole");
var outputFormat_1 = require("../state/outputFormat");
jest.mock('../errorAndExit', function () { return ({
    __esModule: true,
    errorAndExit: jest.fn(),
}); });
jest.mock('../checkForUpdate', function () { return ({
    __esModule: true,
    checkForUpdate: jest.fn(),
}); });
jest.mock('../trackActivity', function () { return ({
    __esModule: true,
    trackActivity: jest.fn(),
}); });
jest.mock('../tryToExtractRole', function () { return ({
    __esModule: true,
    tryToExtractRole: jest.fn(),
}); });
jest.mock('../state/alksAccount', function () { return ({
    __esModule: true,
    getAlksAccount: jest.fn(),
}); });
jest.mock('../state/alksRole', function () { return ({
    __esModule: true,
    getAlksRole: jest.fn(),
}); });
jest.mock('../state/getOutputFormat', function () { return ({
    __esModule: true,
    getOutputFormat: jest.fn(),
}); });
jest.mock('../getIamKey', function () { return ({
    __esModule: true,
    getIamKey: jest.fn(),
}); });
jest.mock('../getKeyOutput', function () { return ({
    __esModule: true,
    getKeyOutput: jest.fn(),
}); });
jest.mock('../getSessionKey', function () { return ({
    __esModule: true,
    getSessionKey: jest.fn(),
}); });
jest.mock('../log', function () { return ({
    __esModule: true,
    log: jest.fn(),
}); });
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(function () { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(function () { });
describe('handleAlksSessionsOpen', function () {
    var defaultTestCase = {
        options: {},
        program: {},
        shouldErr: false,
        checkForUpdateFails: false,
        trackActivityFails: false,
        tryToExtractRoleFails: false,
        shouldTryToExtractRole: false,
        extractedRole: '',
        getAlksAccountFails: false,
        alksAccount: '000000000000/ALKSAdmin - awszero',
        getAlksRoleFails: false,
        alksRole: 'Admin',
        getOutputFormatFails: false,
        outputFormat: 'env',
        shouldGetIamKey: false,
        getIamKeyFails: false,
        getIamKeyParams: {
            alksAccount: '',
            alksRole: '',
            newSession: undefined,
            favorites: undefined,
        },
        getSessionKeyParams: {
            alksAccount: '',
            alksRole: '',
            iamOnly: false,
            newSession: undefined,
            favorites: undefined,
        },
        shouldGetSessionKey: false,
        getSessionKeyFails: false,
        key: {},
        getKeyOutputFails: false,
        shouldGetKeyOutput: false,
        getKeyOutputParams: {
            format: '',
            profile: undefined,
            force: undefined,
        },
        keyOutput: '',
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when requesting default account and getAlksAccount fails', shouldErr: true, options: {
                default: true,
            }, getAlksAccountFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when requesting default account and getAlksRole fails', shouldErr: true, options: {
                default: true,
            }, getAlksRoleFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getting an IAM key fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, getIamKeyFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getting a session key fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', shouldGetSessionKey: true, getSessionKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                iamOnly: false,
                newSession: undefined,
                favorites: undefined,
            }, getSessionKeyFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getOutputFormat fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', getOutputFormatFails: true, shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getKeyOutput fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            }, getKeyOutputFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when checkForUpdate fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            }, checkForUpdateFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when trackActivity fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            }, trackActivityFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getIamKey succeeds', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getSessionKey succeeds', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetSessionKey: true, getSessionKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                iamOnly: false,
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: false,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when everything succeeds and a profile is passed', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
                namedProfile: 'bobbybob',
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: 'bobbybob',
                force: undefined,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when everything succeeds and "force" is passed', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
                force: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: true,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no role is passed and tryToExtractRole succeeds', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                iam: true,
            }, shouldTryToExtractRole: true, extractedRole: 'Admin', alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no role is passed and tryToExtractRole fails', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                iam: true,
            }, shouldTryToExtractRole: true, tryToExtractRoleFails: true, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: undefined,
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '998877665544/ALKSReadOnly - awsother',
                alksRole: 'ReadOnly',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no role is passed and tryToExtractRole fails but default flag is passed', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                default: true,
                iam: true,
            }, shouldTryToExtractRole: true, tryToExtractRoleFails: true, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '444455556666/ALKSPowerUser - awsthing',
                alksRole: 'PowerUser',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '444455556666/ALKSPowerUser - awsthing',
                alksRole: 'PowerUser',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no account or role is passed', shouldErr: false, options: {
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: undefined,
                alksRole: undefined,
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '998877665544/ALKSReadOnly - awsother',
                alksRole: 'ReadOnly',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            } }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when no account or role is passed but default flag is passed', shouldErr: false, options: {
                default: true,
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '444455556666/ALKSPowerUser - awsthing',
                alksRole: 'PowerUser',
                newSession: undefined,
                favorites: undefined,
            }, key: {
                alksAccount: '444455556666/ALKSPowerUser - awsthing',
                alksRole: 'PowerUser',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            }, shouldGetKeyOutput: true, getKeyOutputParams: {
                format: 'env',
                profile: undefined,
                force: undefined,
            } }),
    ];
    var fakeErrorSymbol = Symbol();
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
                            trackActivity_1.trackActivity.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.trackActivityFails) {
                                        throw new Error();
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            errorAndExit_1.errorAndExit.mockImplementation(function () {
                                errorThrown = true;
                                // We have to throw an error to get execution to stop
                                throw fakeErrorSymbol;
                            });
                            tryToExtractRole_1.tryToExtractRole.mockImplementation(function () {
                                if (t.tryToExtractRoleFails) {
                                    return undefined;
                                }
                                else {
                                    return t.extractedRole;
                                }
                            });
                            alksAccount_1.getAlksAccount.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.getAlksAccountFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.alksAccount];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            alksRole_1.getAlksRole.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.getAlksRoleFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.alksRole];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            outputFormat_1.getOutputFormat.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.getOutputFormatFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.outputFormat];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            getIamKey_1.getIamKey.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.getIamKeyFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.key];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            getSessionKey_1.getSessionKey.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.getSessionKeyFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.key];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            getKeyOutput_1.getKeyOutput.mockImplementation(function () {
                                if (t.getKeyOutputFails) {
                                    throw new Error();
                                }
                                else {
                                    return t.keyOutput;
                                }
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, alks_sessions_open_1.handleAlksSessionsOpen(t.options)];
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
            if (t.shouldTryToExtractRole) {
                it('attempts to extract a role from the account string', function () {
                    expect(tryToExtractRole_1.tryToExtractRole).toHaveBeenCalledWith(t.options.account);
                });
            }
            else {
                it('does not attempt to extract a role from the account string', function () {
                    expect(tryToExtractRole_1.tryToExtractRole).not.toHaveBeenCalled();
                });
            }
            if (t.shouldGetIamKey) {
                it('attempts to fetch an IAM key', function () {
                    expect(getIamKey_1.getIamKey).toHaveBeenCalledWith(t.program, t.getIamKeyParams.alksAccount, t.getIamKeyParams.alksRole, t.getIamKeyParams.newSession, t.getIamKeyParams.favorites);
                });
            }
            else {
                it('does not attempt to fetch an IAM key', function () {
                    expect(getIamKey_1.getIamKey).not.toHaveBeenCalled();
                });
            }
            if (t.shouldGetSessionKey) {
                it('attempts to fetch a session key', function () {
                    expect(getSessionKey_1.getSessionKey).toHaveBeenCalledWith(t.program, t.getSessionKeyParams.alksAccount, t.getSessionKeyParams.alksRole, t.getSessionKeyParams.iamOnly, t.getSessionKeyParams.newSession, t.getSessionKeyParams.favorites);
                });
            }
            else {
                it('does not attempt to fetch a session key', function () {
                    expect(getSessionKey_1.getSessionKey).not.toHaveBeenCalled();
                });
            }
            if (t.shouldGetKeyOutput) {
                it('gets key output', function () {
                    expect(getKeyOutput_1.getKeyOutput).toHaveBeenCalledWith(t.getKeyOutputParams.format, t.key, t.getKeyOutputParams.profile, t.getKeyOutputParams.force);
                });
            }
            else {
                it('does not get key output', function () {
                    expect(getKeyOutput_1.getKeyOutput).not.toHaveBeenCalled();
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=alks-sessions-open.test.js.map