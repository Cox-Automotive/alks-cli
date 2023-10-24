"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
const alks_iam_createltk_1 = require("./alks-iam-createltk");
const tryToExtractRole_1 = require("../tryToExtractRole");
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../getAlks');
jest.mock('../getAuth');
jest.mock('alks.js');
jest.mock('../promptForAlksAccountAndRole');
jest.mock('../tryToExtractRole');
jest.mock('../getAwsAccountFromString');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => { });
describe('handleAlksIamCreateLtk', () => {
    const defaultTestCase = {
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
        getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    };
    const testCases = [
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no tags nor empty list is provided', shouldErr: false, shouldCreateLTK: true, options: {
                account: '111111111111',
                role: 'Role',
                iamusername: 'goodIamUserName',
            }, createLTKParams: {
                account: '111111111111',
                role: 'Role',
                iamUserName: 'goodIamUserName',
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when empty list of tags is supplied', shouldErr: false, options: {
                account: '111111111111',
                role: 'Role',
                iamusername: 'goodIamUserName',
                tags: [],
            }, createLTKParams: {
                account: '111111111111',
                role: 'Role',
                iamUserName: 'goodIamUserName',
                tags: [],
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no username is supplied', shouldErr: true, shouldCreateLTK: false, options: {
                account: '111111111111',
                role: 'AlksRole',
                tags: [],
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'When good data is supplied', shouldErr: false, options: {
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
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'When Account has role and no role supplied', shouldErr: false, alksAccount: '111111111111/ALKSRole', alksRole: 'Role', options: {
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
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'When account is supplied with accountID and roleName', shouldErr: false, extractedRole: 'Role', options: {
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
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111112',
                    alias: 'awstwo',
                    label: 'Two - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'When no matching account is found', shouldErr: true, extractedRole: 'Role', options: {
                account: '111111111112/ALKSRole',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            }, shouldCreateLTK: false, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }) }),
    ];
    const fakeErrorSymbol = Symbol();
    const mockAlks = {
        createAccessKeys: jest.fn(),
    };
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
                    throw fakeErrorSymbol;
                });
                tryToExtractRole_1.tryToExtractRole.mockImplementation(() => {
                    return t.extractedRole;
                });
                promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockImplementation(() => {
                    console.log('Prompting for alks account and role???');
                    return {
                        alksAccount: t.alksAccount,
                        alksRole: t.alksRole,
                    };
                });
                getAuth_1.getAuth.mockImplementation(() => {
                    return { accessToken: 'token' };
                });
                getAlks_1.getAlks.mockImplementation(() => {
                    return mockAlks;
                });
                mockAlks.createAccessKeys.mockImplementation(() => {
                    return t.createLTKOutputParams;
                });
                getAwsAccountFromString_1.getAwsAccountFromString.mockImplementation(t.getAwsAccountFromString);
                try {
                    yield (0, alks_iam_createltk_1.handleAlksIamCreateLtk)(t.options);
                }
                catch (e) {
                    if (!(e === fakeErrorSymbol)) {
                        throw e;
                    }
                }
            }));
            afterEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                checkForUpdate_1.checkForUpdate.mockReset();
                errorAndExit_1.errorAndExit.mockReset();
                promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockReset();
                getAuth_1.getAuth.mockReset();
                getAlks_1.getAlks.mockReset();
                mockAlks.createAccessKeys.mockReset();
                tryToExtractRole_1.tryToExtractRole.mockReset();
                getAwsAccountFromString_1.getAwsAccountFromString.mockReset();
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
            if (t.shouldCreateLTK) {
                it('creates IAM User', () => {
                    expect(mockAlks.createAccessKeys).toHaveBeenCalledWith(t.createLTKParams);
                });
            }
            else {
                it('does not create ltk', () => {
                    expect(mockAlks.createAccessKeys).not.toHaveBeenCalled();
                });
            }
        });
    }
});
//# sourceMappingURL=alks-developer-accounts.test.js.map