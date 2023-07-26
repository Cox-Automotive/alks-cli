"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const getAwsAccountFromString_1 = require("./getAwsAccountFromString");
const getAlksAccounts_1 = require("./getAlksAccounts");
jest.mock('./getAlksAccounts');
const defaultTestCase = {
    result: undefined,
    shouldThrow: false,
    getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return []; }),
};
const firstAccountId = '012345678910';
const firstAccountAlias = 'awsfirst';
const firstAccountLabel = 'First - Prod';
const secondAccountId = '200020002000';
const secondAccountAlias = 'awssecond';
const secondAccountLabel = 'Second - Prod';
function fakeAlksAccount(id, alias, label, role) {
    return {
        account: `${id}/ALKS${role} - ${alias}`,
        role,
        iamKeyActive: true,
        maxKeyDuration: 1,
        securityLevel: '1',
        skypieaAccount: {
            label,
            accountOwners: [],
            cloudsploitTrend: [],
        },
    };
}
const testCases = [
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an empty string is passed and no accounts match', alksAccount: '', result: undefined }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an account id is passed but there are no accounts to match', alksAccount: firstAccountId, result: undefined }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an account id is passed and there is a match', alksAccount: firstAccountId, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
            ];
        }), result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an account id is passed and there are multiple matches', alksAccount: firstAccountId, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Security'),
            ];
        }), result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an account id is passed and there are no matches', alksAccount: firstAccountId, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Admin'),
                fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Security'),
            ];
        }), result: undefined }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an alias is passed and there is a match', alksAccount: firstAccountAlias, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
            ];
        }), result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an alias is passed and there are multiple matches', alksAccount: firstAccountAlias, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Security'),
            ];
        }), result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an alias is passed and there are no matches', alksAccount: firstAccountAlias, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Admin'),
                fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Security'),
            ];
        }), result: undefined }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an account string is passed and there is a match', alksAccount: `${firstAccountId}/ALKSAdmin - ${firstAccountAlias}`, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
            ];
        }), result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an account string is passed and there are multiple matches', alksAccount: `${firstAccountId}/ALKSAdmin - ${firstAccountAlias}`, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Security'),
            ];
        }), result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    Object.assign(Object.assign({}, defaultTestCase), { description: 'when an account string is passed and there are no matches', alksAccount: `${firstAccountId}/ALKSAdmin - ${firstAccountAlias}`, getAlksAccounts: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return [
                fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Admin'),
                fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Security'),
            ];
        }), result: undefined }),
];
describe('getAwsAccountFromString', () => {
    for (const t of testCases) {
        describe(t.description, () => {
            let result;
            let errorThrown = false;
            beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                getAlksAccounts_1.getAlksAccounts.mockImplementation(t.getAlksAccounts);
                try {
                    result = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(t.alksAccount);
                }
                catch (e) {
                    errorThrown = true;
                }
            }));
            if (t.shouldThrow) {
                it('throws an error', () => {
                    expect(errorThrown).toBe(true);
                });
            }
            else {
                it(`doesn't throw an error`, () => {
                    expect(errorThrown).toBe(false);
                });
                it('returns the correct result', () => {
                    expect(result).toEqual(t.result);
                });
            }
        });
    }
});
//# sourceMappingURL=getAwsAccountFromString.test.js.map