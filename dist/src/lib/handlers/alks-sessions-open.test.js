"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errorAndExit_1 = require("../errorAndExit");
const checkForUpdate_1 = require("../checkForUpdate");
const tryToExtractRole_1 = require("../tryToExtractRole");
const getKeyOutput_1 = require("../getKeyOutput");
const getIamKey_1 = require("../getIamKey");
const alks_sessions_open_1 = require("./alks-sessions-open");
const alksAccount_1 = require("../state/alksAccount");
const alksRole_1 = require("../state/alksRole");
const outputFormat_1 = require("../state/outputFormat");
jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../tryToExtractRole');
jest.mock('../state/alksAccount');
jest.mock('../state/alksRole');
jest.mock('../state/outputFormat');
jest.mock('../getIamKey');
jest.mock('../getKeyOutput');
jest.mock('../log');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => { });
describe('handleAlksSessionsOpen', () => {
    const defaultTestCase = {
        options: {},
        shouldErr: false,
        checkForUpdateFails: false,
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
            iamOnly: true,
            duration: undefined,
        },
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
    const testCases = [
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when requesting default account and getAlksAccount fails', shouldErr: true, options: {
                default: true,
            }, getAlksAccountFails: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when requesting default account and getAlksRole fails', shouldErr: true, options: {
                default: true,
            }, getAlksRoleFails: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getting an IAM key fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
            }, getIamKeyFails: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getting a session key fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: false,
                duration: undefined,
            }, getIamKeyFails: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getOutputFormat fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', getOutputFormatFails: true, shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
            }, key: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                isIAM: true,
                expires: new Date(),
                accessKey: 'abcd',
                secretKey: 'efgh',
                sessionToken: 'ijkl',
            } }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getKeyOutput fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when checkForUpdate fails', shouldErr: true, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getIamKey succeeds', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getSessionKey succeeds', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: false,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when everything succeeds and a profile is passed', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
                namedProfile: 'bobbybob',
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when everything succeeds and "force" is passed', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
                force: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no role is passed and tryToExtractRole succeeds', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                iam: true,
            }, shouldTryToExtractRole: true, extractedRole: 'Admin', alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: 'Admin',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no role is passed and tryToExtractRole fails', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                iam: true,
            }, shouldTryToExtractRole: true, tryToExtractRoleFails: true, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '012345678910/ALKSAdmin - awstest',
                alksRole: undefined,
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no role is passed and tryToExtractRole fails but default flag is passed', shouldErr: false, options: {
                account: '012345678910/ALKSAdmin - awstest',
                default: true,
                iam: true,
            }, shouldTryToExtractRole: true, tryToExtractRoleFails: true, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '444455556666/ALKSPowerUser - awsthing',
                alksRole: 'PowerUser',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no account or role is passed', shouldErr: false, options: {
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: undefined,
                alksRole: undefined,
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no account or role is passed but default flag is passed', shouldErr: false, options: {
                default: true,
                iam: true,
            }, alksAccount: '444455556666/ALKSPowerUser - awsthing', alksRole: 'PowerUser', outputFormat: 'env', shouldGetIamKey: true, getIamKeyParams: {
                alksAccount: '444455556666/ALKSPowerUser - awsthing',
                alksRole: 'PowerUser',
                newSession: undefined,
                favorites: undefined,
                iamOnly: true,
                duration: undefined,
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
    const fakeErrorSymbol = Symbol();
    for (const t of testCases) {
        describe(t.description, () => {
            let errorThrown = false;
            beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                checkForUpdate_1.checkForUpdate.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.checkForUpdateFails) {
                        throw new Error();
                    }
                }));
                errorAndExit_1.errorAndExit.mockImplementation(() => {
                    errorThrown = true;
                    // We have to throw an error to get execution to stop
                    throw fakeErrorSymbol;
                });
                tryToExtractRole_1.tryToExtractRole.mockImplementation(() => {
                    if (t.tryToExtractRoleFails) {
                        return undefined;
                    }
                    else {
                        return t.extractedRole;
                    }
                });
                alksAccount_1.getAlksAccount.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.getAlksAccountFails) {
                        throw new Error();
                    }
                    else {
                        return t.alksAccount;
                    }
                }));
                alksRole_1.getAlksRole.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.getAlksRoleFails) {
                        throw new Error();
                    }
                    else {
                        return t.alksRole;
                    }
                }));
                outputFormat_1.getOutputFormat.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.getOutputFormatFails) {
                        throw new Error();
                    }
                    else {
                        return t.outputFormat;
                    }
                }));
                getIamKey_1.getIamKey.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.getIamKeyFails) {
                        throw new Error();
                    }
                    else {
                        return t.key;
                    }
                }));
                getKeyOutput_1.getKeyOutput.mockImplementation(() => {
                    if (t.getKeyOutputFails) {
                        throw new Error();
                    }
                    else {
                        return t.keyOutput;
                    }
                });
                try {
                    yield (0, alks_sessions_open_1.handleAlksSessionsOpen)(t.options);
                }
                catch (e) {
                    if (!(e === fakeErrorSymbol)) {
                        throw e;
                    }
                }
            }));
            if (t.shouldErr) {
                it('calls errorAndExit', () => {
                    expect(errorThrown).toBe(true);
                });
            }
            else {
                it(`doesn't call errorAndExit`, () => {
                    expect(errorThrown).toBe(false);
                });
            }
            if (t.shouldTryToExtractRole) {
                it('attempts to extract a role from the account string', () => {
                    expect(tryToExtractRole_1.tryToExtractRole).toHaveBeenCalledWith(t.options.account);
                });
            }
            else {
                it('does not attempt to extract a role from the account string', () => {
                    expect(tryToExtractRole_1.tryToExtractRole).not.toHaveBeenCalled();
                });
            }
            if (t.shouldGetIamKey) {
                it('attempts to fetch an IAM key', () => {
                    expect(getIamKey_1.getIamKey).toHaveBeenCalledWith(t.getIamKeyParams.alksAccount, t.getIamKeyParams.alksRole, t.getIamKeyParams.newSession, t.getIamKeyParams.favorites, t.getIamKeyParams.iamOnly, t.getIamKeyParams.duration);
                });
            }
            else {
                it('does not attempt to fetch an IAM key', () => {
                    expect(getIamKey_1.getIamKey).not.toHaveBeenCalled();
                });
            }
            if (t.shouldGetKeyOutput) {
                it('gets key output', () => {
                    expect(getKeyOutput_1.getKeyOutput).toHaveBeenCalledWith(t.getKeyOutputParams.format, t.key, t.getKeyOutputParams.profile, t.getKeyOutputParams.force);
                });
            }
            else {
                it('does not get key output', () => {
                    expect(getKeyOutput_1.getKeyOutput).not.toHaveBeenCalled();
                });
            }
        });
    }
});
//# sourceMappingURL=alks-sessions-open.test.js.map