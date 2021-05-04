"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errorAndExit_1 = require("../errorAndExit");
var alks_developer_configure_1 = require("./alks-developer-configure");
var promptForServer_1 = require("../promptForServer");
var promptForUserId_1 = require("../promptForUserId");
var promptForPassword_1 = require("../promptForPassword");
var confirm_1 = require("../confirm");
var savePassword_1 = require("../savePassword");
var getAlksAccount_1 = require("../getAlksAccount");
var promptForOutputFormat_1 = require("../promptForOutputFormat");
var saveDeveloper_1 = require("../saveDeveloper");
var checkForUpdate_1 = require("../checkForUpdate");
var trackActivity_1 = require("../trackActivity");
var getAuth_1 = require("../getAuth");
jest.mock('../errorAndExit', function () { return ({
    __esModule: true,
    errorAndExit: jest.fn(),
}); });
jest.mock('../promptForServer', function () { return ({
    __esModule: true,
    promptForServer: jest.fn(),
}); });
jest.mock('../promptForUserId', function () { return ({
    __esModule: true,
    promptForUserId: jest.fn(),
}); });
jest.mock('../promptForPassword', function () { return ({
    __esModule: true,
    promptForPassword: jest.fn(),
}); });
jest.mock('../confirm', function () { return ({
    __esModule: true,
    confirm: jest.fn(),
}); });
jest.mock('../savePassword', function () { return ({
    __esModule: true,
    savePassword: jest.fn(),
}); });
jest.mock('../getAlksAccount', function () { return ({
    __esModule: true,
    getAlksAccount: jest.fn(),
}); });
jest.mock('../promptForOutputFormat', function () { return ({
    __esModule: true,
    promptForOutputFormat: jest.fn(),
}); });
jest.mock('../saveDeveloper', function () { return ({
    __esModule: true,
    saveDeveloper: jest.fn(),
}); });
jest.mock('../checkForUpdate', function () { return ({
    __esModule: true,
    checkForUpdate: jest.fn(),
}); });
jest.mock('../trackActivity', function () { return ({
    __esModule: true,
    trackActivity: jest.fn(),
}); });
jest.mock('../getAuth', function () { return ({
    __esModule: true,
    cacheAuth: jest.fn(),
}); });
describe('handleAlksDeveloperConfigure', function () {
    var defaultTestCase = {
        options: {},
        program: {},
        shouldErr: false,
        promptForServerFails: false,
        server: '',
        promptForUserIdFails: false,
        userId: '',
        promptForPasswordFails: false,
        password: '',
        confirmSavePasswordFails: false,
        savePassword: false,
        savePasswordFails: false,
        shouldCacheAuth: false,
        getAlksAccountFails: false,
        alksAccount: '',
        alksRole: '',
        promptForOutputFormatFails: false,
        outputFormat: '',
        saveDeveloperFails: false,
        checkForUpdateFails: false,
        tractActivityFails: false,
        shouldSavePassword: false,
        shouldSaveDeveloper: false,
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when prompting for the server url fails', shouldErr: true, promptForServerFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when prompting for a username fails', shouldErr: true, server: 'https://alks.com/rest', promptForUserIdFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when prompting for the password fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', promptForPasswordFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when confirming if the user wants to save password fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', confirmSavePasswordFails: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when saving the password fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, savePasswordFails: true, shouldSavePassword: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when getting the alks account fails', shouldErr: true, shouldCacheAuth: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, getAlksAccountFails: true, shouldSavePassword: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when prompting for the output format fails', shouldErr: true, shouldCacheAuth: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', promptForOutputFormatFails: true, shouldSavePassword: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when saving developer fails', shouldErr: false, shouldCacheAuth: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', saveDeveloperFails: true, shouldSavePassword: true, shouldSaveDeveloper: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when checkForUpdate fails', shouldErr: true, shouldCacheAuth: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', checkForUpdateFails: true, shouldSavePassword: true, shouldSaveDeveloper: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when tracking activity fails', shouldErr: true, shouldCacheAuth: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', tractActivityFails: true, shouldSavePassword: true, shouldSaveDeveloper: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when everything succeeds', shouldErr: false, shouldCacheAuth: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', shouldSavePassword: true, shouldSaveDeveloper: true }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when everything succeeds but the user declines saving password', shouldErr: false, shouldCacheAuth: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', shouldSaveDeveloper: true }),
    ];
    var _loop_1 = function (t) {
        describe(t.description, function () {
            var errorThrown = false;
            beforeEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promptForServer_1.promptForServer.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.promptForServerFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.server];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            promptForUserId_1.promptForUserId.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.promptForUserIdFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.userId];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            promptForPassword_1.promptForPassword.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.promptForPasswordFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.password];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            confirm_1.confirm.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.confirmSavePasswordFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.savePassword];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            savePassword_1.savePassword.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.savePasswordFails) {
                                        throw new Error();
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            getAlksAccount_1.getAlksAccount.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.getAlksAccountFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, { alksAccount: t.alksAccount, alksRole: t.alksRole }];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            promptForOutputFormat_1.promptForOutputFormat.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.promptForOutputFormatFails) {
                                        throw new Error();
                                    }
                                    else {
                                        return [2 /*return*/, t.outputFormat];
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            saveDeveloper_1.saveDeveloper.mockImplementation(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    if (t.saveDeveloperFails) {
                                        throw new Error();
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
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
                                    if (t.tractActivityFails) {
                                        throw new Error();
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            errorAndExit_1.errorAndExit.mockImplementation(function () {
                                errorThrown = true;
                            });
                            return [4 /*yield*/, alks_developer_configure_1.handleAlksDeveloperConfigure({}, {})];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
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
            if (t.shouldCacheAuth) {
                it('calls cacheAuth with the correct parameters', function () {
                    expect(getAuth_1.cacheAuth).toBeCalledWith({
                        userid: t.userId,
                        password: t.password,
                    });
                });
            }
            if (t.shouldSavePassword) {
                it('attempts to save password', function () {
                    expect(savePassword_1.savePassword).toBeCalledWith(t.password);
                });
            }
            if (t.shouldSaveDeveloper) {
                it('saves developer with the correct fields', function () {
                    expect(saveDeveloper_1.saveDeveloper).toBeCalledWith({
                        server: t.server,
                        userid: t.userId,
                        alksAccount: t.alksAccount,
                        alksRole: t.alksRole,
                        outputFormat: t.outputFormat,
                    });
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=alks-developer-configure.test.js.map