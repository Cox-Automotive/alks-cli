"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
const alks_iam_updateiamuser_1 = require("./alks-iam-updateiamuser");
jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../getAlks');
jest.mock('../getAuth');
jest.mock('alks.js');
jest.mock('../getAwsAccountFromString');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => { });
describe('handleAlksIamUpdateIamUser', () => {
    const defaultTestCase = {
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
        getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    };
    const testCases = [
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when bad accountId is supplied', shouldErr: true, shouldUpdateIamUser: false, options: {
                account: 'badAccountId',
                iamusername: 'goodIamUserName',
                tags: [
                    '{"Key":"key1", "Value":"val1"}',
                    '{"Key":"key2", "Value":"val2"}',
                ],
            } }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no tags nor empty list is provided', shouldErr: true, shouldUpdateIamUser: false, options: {
                account: '111111111111',
                iamusername: 'goodIamUserName',
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when empty list of tags is supplied', shouldErr: false, shouldUpdateIamUser: true, options: {
                account: '111111111111',
                iamusername: 'goodIamUserName',
                tags: [],
            }, updateIamUserParams: {
                account: '111111111111',
                iamUserName: 'goodIamUserName',
                tags: [],
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no username is supplied', shouldErr: true, shouldUpdateIamUser: false, options: {
                account: '111111111111',
                tags: [],
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'When good data is supplied', shouldErr: false, shouldUpdateIamUser: true, options: {
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
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'When account is supplied with accountID and roleName', shouldErr: false, shouldUpdateIamUser: true, options: {
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
            }, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: '111111111111',
                    alias: 'awsone',
                    label: 'One - Prod',
                });
            }) }),
    ];
    const fakeErrorSymbol = Symbol();
    const mockAlks = {
        updateIamUser: jest.fn(),
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
                getAuth_1.getAuth.mockImplementation(() => {
                    return { accessToken: 'token' };
                });
                getAlks_1.getAlks.mockImplementation(() => {
                    return mockAlks;
                });
                mockAlks.updateIamUser.mockImplementation(() => {
                    return t.updateIamUserOutputParams;
                });
                getAwsAccountFromString_1.getAwsAccountFromString.mockImplementation(t.getAwsAccountFromString);
                try {
                    yield (0, alks_iam_updateiamuser_1.handleAlksIamUpdateIamUser)(t.options);
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
            if (t.shouldUpdateIamUser) {
                it('updates IAM User', () => {
                    expect(mockAlks.updateIamUser).toHaveBeenCalledWith(t.updateIamUserParams);
                });
            }
            else {
                it('does not get key output', () => {
                    expect(mockAlks.updateIamUser).not.toHaveBeenCalled();
                });
            }
        });
    }
});
//# sourceMappingURL=alks-iam-updateiamuser.test.js.map