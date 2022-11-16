"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var getAwsAccountFromString_1 = require("./getAwsAccountFromString");
var getAlksAccounts_1 = require("./getAlksAccounts");
jest.mock('./getAlksAccounts');
var defaultTestCase = {
    result: undefined,
    shouldThrow: false,
    getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); },
};
var firstAccountId = '012345678910';
var firstAccountAlias = 'awsfirst';
var firstAccountLabel = 'First - Prod';
var secondAccountId = '200020002000';
var secondAccountAlias = 'awssecond';
var secondAccountLabel = 'Second - Prod';
function fakeAlksAccount(id, alias, label, role) {
    return {
        account: "".concat(id, "/ALKS").concat(role, " - ").concat(alias),
        role: role,
        iamKeyActive: true,
        maxKeyDuration: 1,
        securityLevel: '1',
        skypieaAccount: {
            label: label,
            accountOwners: [],
            cloudsploitTrend: [],
        },
    };
}
var testCases = [
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an empty string is passed and no accounts match', alksAccount: '', result: undefined }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an account id is passed but there are no accounts to match', alksAccount: firstAccountId, result: undefined }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an account id is passed and there is a match', alksAccount: firstAccountId, getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                    ]];
            });
        }); }, result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an account id is passed and there are multiple matches', alksAccount: firstAccountId, getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Security'),
                    ]];
            });
        }); }, result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an account id is passed and there are no matches', alksAccount: firstAccountId, getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Admin'),
                        fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Security'),
                    ]];
            });
        }); }, result: undefined }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an alias is passed and there is a match', alksAccount: firstAccountAlias, getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                    ]];
            });
        }); }, result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an alias is passed and there are multiple matches', alksAccount: firstAccountAlias, getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Security'),
                    ]];
            });
        }); }, result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an alias is passed and there are no matches', alksAccount: firstAccountAlias, getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Admin'),
                        fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Security'),
                    ]];
            });
        }); }, result: undefined }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an account string is passed and there is a match', alksAccount: "".concat(firstAccountId, "/ALKSAdmin - ").concat(firstAccountAlias), getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                    ]];
            });
        }); }, result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an account string is passed and there are multiple matches', alksAccount: "".concat(firstAccountId, "/ALKSAdmin - ").concat(firstAccountAlias), getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Admin'),
                        fakeAlksAccount(firstAccountId, firstAccountAlias, firstAccountLabel, 'Security'),
                    ]];
            });
        }); }, result: {
            id: firstAccountId,
            alias: firstAccountAlias,
            label: firstAccountLabel,
        } }),
    tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an account string is passed and there are no matches', alksAccount: "".concat(firstAccountId, "/ALKSAdmin - ").concat(firstAccountAlias), getAlksAccounts: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Admin'),
                        fakeAlksAccount(secondAccountId, secondAccountAlias, secondAccountLabel, 'Security'),
                    ]];
            });
        }); }, result: undefined }),
];
describe('getAwsAccountFromString', function () {
    var _loop_1 = function (t) {
        describe(t.description, function () {
            var result;
            var errorThrown = false;
            beforeEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var e_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            getAlksAccounts_1.getAlksAccounts.mockImplementation(t.getAlksAccounts);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, getAwsAccountFromString_1.getAwsAccountFromString)(t.alksAccount)];
                        case 2:
                            result = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            errorThrown = true;
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            if (t.shouldThrow) {
                it('throws an error', function () {
                    expect(errorThrown).toBe(true);
                });
            }
            else {
                it("doesn't throw an error", function () {
                    expect(errorThrown).toBe(false);
                });
                it('returns the correct result', function () {
                    expect(result).toEqual(t.result);
                });
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=getAwsAccountFromString.test.js.map