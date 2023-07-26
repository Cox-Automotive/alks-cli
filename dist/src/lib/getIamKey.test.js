"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ensureConfigured_1 = require("./ensureConfigured");
const getAlks_1 = require("./getAlks");
const promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
const getAuth_1 = require("./getAuth");
const getIamKey_1 = require("./getIamKey");
const getKeys_1 = require("./getKeys");
const log_1 = require("./log");
const addKey_1 = require("./addKey");
const moment_1 = tslib_1.__importDefault(require("moment"));
const getAwsAccountFromString_1 = require("./getAwsAccountFromString");
jest.mock('./ensureConfigured');
jest.mock('./getAuth');
jest.mock('./promptForAlksAccountAndRole');
jest.mock('./log');
jest.mock('./getKeys');
jest.mock('./getAlks');
jest.mock('./addKey');
jest.mock('moment');
jest.mock('./getAwsAccountFromString');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
const date = new Date();
const defaultAccountId = '012345678910';
const defaultRole = 'Admin';
const passedAccountId = '999888777666';
const passedAccountAlias = 'awsother';
const passedAccount = `${passedAccountId}/ALKSReadOnly - ${passedAccountAlias}`;
const passedRole = 'ReadOnly';
const selectedAccountId = '444455556666';
const selectedAccountAlias = 'awsthing';
const selectedAccount = `${selectedAccountId}/ALKSPowerUser - ${selectedAccountAlias}`;
const selectedRole = 'PowerUser';
describe('getIamKey', () => {
    const defaultTestCase = {
        program: {},
        alksAccount: passedAccount,
        alksRole: passedRole,
        forceNewSession: false,
        filterFavorites: false,
        result: {
            alksAccount: passedAccountId,
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
        ensureConfigured: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return ({
                token: 'thisisatoken',
            });
        }),
        promptForAlksAccountAndRole: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return ({
                alksAccount: selectedAccount,
                alksRole: selectedRole,
            });
        }),
        log: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        getKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return []; }),
        getAlks: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return ({
                getLoginRole: ({ accountId, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        account: `${accountId}/ALKS${role}`,
                        role,
                        iamKeyActive: true,
                        maxKeyDuration: 12,
                        skypieaAccount: null,
                    });
                }),
                getIAMKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        accessKey: 'abcd',
                        secretKey: 'efgh',
                        sessionToken: 'ijkl',
                        consoleURL: 'https://login.aws.com/my-account',
                    });
                }),
            });
        }),
        addKey: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return ({
                id: passedAccountId,
                alias: passedAccountAlias,
                label: 'Some Account Label',
            });
        }),
    };
    const testCases = [
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when not configured', shouldThrow: true, ensureConfigured: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw new Error();
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no keys exist', shouldSaveKey: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when forceNewSession is true', forceNewSession: true, shouldSaveKey: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when an existing session exists', getKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return [
                    {
                        alksAccount: passedAccountId,
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
                ];
            }), result: Object.assign(Object.assign({}, defaultTestCase.result), { accessKey: 'oooo', secretKey: 'ohhh', sessionToken: 'ahhh' }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when an existing session exists but forceNewSession is true', forceNewSession: true, shouldSaveKey: true, getKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return [
                    {
                        alksAccount: passedAccountId,
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
                ];
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when an existing session exists for the wrong account', shouldSaveKey: true, getKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return [
                    {
                        alksAccount: defaultAccountId,
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
                ];
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when multiple existing sessions exist', getKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return [
                    {
                        alksAccount: passedAccountId,
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
                        alksAccount: passedAccountId,
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
                ];
            }), result: Object.assign(Object.assign({}, defaultTestCase.result), { accessKey: 'zoo', secretKey: 'zaz', sessionToken: 'zba', expires: new Date(date.getTime() + 1) }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no account or role is passed', shouldSaveKey: true, shouldGetAlksAccount: true, alksAccount: undefined, alksRole: undefined, result: Object.assign(Object.assign({}, defaultTestCase.result), { alksAccount: selectedAccountId, alksRole: selectedRole }), getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: selectedAccountId,
                    alias: selectedAccountAlias,
                    label: 'Some Selected Account',
                });
            }) }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getting existing keys fails', getKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw new Error();
            }), shouldThrow: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when alks.getLoginRole fails', getAlks: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    getLoginRole: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        throw new Error();
                    }),
                    getIAMKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        return (yield defaultTestCase.getAlks({})).getIAMKeys({});
                    }),
                });
            }), shouldThrow: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when alks.getIAMKeys fails', getAlks: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    getLoginRole: (props) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        return (yield defaultTestCase.getAlks({})).getLoginRole(props);
                    }),
                    getIAMKeys: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        throw new Error();
                    }),
                });
            }), shouldThrow: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when saving the key fails', addKey: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw new Error();
            }), shouldSaveKey: true, shouldThrow: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when no matching aws account is found', shouldThrow: true, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }) }),
    ];
    for (const t of testCases) {
        describe(t.description, () => {
            let result;
            let errorThrown = false;
            beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                ensureConfigured_1.ensureConfigured.mockImplementation(t.ensureConfigured);
                getAuth_1.getAuth.mockImplementation(t.getAuth);
                promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockImplementation(t.promptForAlksAccountAndRole);
                log_1.log.mockImplementation(t.log);
                getKeys_1.getKeys.mockImplementation(t.getKeys);
                getAlks_1.getAlks.mockImplementation(t.getAlks);
                addKey_1.addKey.mockImplementation(t.addKey);
                moment_1.default.mockImplementation(() => {
                    const moment = {};
                    moment.add = () => moment;
                    moment.toDate = () => date;
                    return moment;
                });
                getAwsAccountFromString_1.getAwsAccountFromString.mockImplementation(t.getAwsAccountFromString);
                try {
                    result = yield (0, getIamKey_1.getIamKey)(t.alksAccount, t.alksRole, t.forceNewSession, t.filterFavorites);
                }
                catch (err) {
                    console.error(err);
                    errorThrown = true;
                }
            }));
            if (t.shouldThrow) {
                it('rejects with an error', () => {
                    expect(errorThrown).toBe(true);
                });
            }
            else {
                it('resolves with the correct key', () => {
                    expect(result).toEqual(expect.objectContaining(t.result));
                });
            }
            if (t.shouldGetAlksAccount) {
                it('calls promptForAlksAccountAndRole to ask for an ALKS account and role', () => {
                    expect(promptForAlksAccountAndRole_1.promptForAlksAccountAndRole).toHaveBeenCalledWith({
                        iamOnly: true,
                        filterFavorites: t.filterFavorites,
                    });
                });
            }
            else {
                it('does not call getAlksAccount', () => {
                    expect(promptForAlksAccountAndRole_1.promptForAlksAccountAndRole).not.toHaveBeenCalled();
                });
            }
            if (t.shouldSaveKey) {
                it('saves the key for later use', () => {
                    expect(addKey_1.addKey).toHaveBeenCalledWith(t.result.accessKey, t.result.secretKey, t.result.sessionToken, t.result.alksAccount, t.result.alksRole, t.result.expires, expect.any(Object), t.result.isIAM);
                });
            }
            else {
                it('does not save the key for later use', () => {
                    expect(addKey_1.addKey).not.toHaveBeenCalled();
                });
            }
        });
    }
});
//# sourceMappingURL=getIamKey.test.js.map