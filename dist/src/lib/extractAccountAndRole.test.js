"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const extractAccountAndRole_1 = require("./extractAccountAndRole");
const log_1 = require("./log");
const tryToExtractRole_1 = require("./tryToExtractRole");
const promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
const getAwsAccountFromString_1 = require("./getAwsAccountFromString");
jest.mock('./log', () => ({
    __esModule: true,
    log: jest.fn(),
}));
jest.mock('./tryToExtractRole', () => ({
    __esModule: true,
    tryToExtractRole: jest.fn(),
}));
jest.mock('./promptForAlksAccountAndRole', () => ({
    __esModule: true,
    promptForAlksAccountAndRole: jest.fn(),
}));
jest.mock('./getAwsAccountFromString', () => ({
    __esModule: true,
    getAwsAccountFromString: jest.fn(),
}));
describe('extractAccountAndRole', () => {
    const testCaseDefaults = {
        shouldThrow: false,
        log: jest.fn(),
        tryToExtractRole: jest.fn(),
        promptForAlksAccountAndRole: jest.fn(),
        getAwsAccountFromString: jest.fn(),
    };
    const testCases = [
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when an account and role are provided', options: {
                account: '012345678910',
                role: 'Admin',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', getAwsAccountFromString: (account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910') {
                    return {
                        id: '012345678910',
                        alias: 'awstest123',
                        label: 'Test 123 - Prod',
                    };
                }
                throw new Error('no account found');
            }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when an account and role are provided but no matching account is found', options: {
                account: '012345678910',
                role: 'Admin',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', shouldThrow: true, getAwsAccountFromString: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw new Error('invalid account');
            }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when only an account string is provided containing the role in the string', options: {
                account: '012345678910/ALKSAdmin',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', tryToExtractRole: (account) => {
                if (account === '012345678910/ALKSAdmin') {
                    return 'Admin';
                }
                throw new Error('no role found');
            }, getAwsAccountFromString: (account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910/ALKSAdmin') {
                    return {
                        id: '012345678910',
                        alias: 'awstest123',
                        label: 'Test 123 - Prod',
                    };
                }
                throw new Error('no account found');
            }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when only an account id is provided', options: {
                account: '012345678910',
            }, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', tryToExtractRole: () => undefined, promptForAlksAccountAndRole: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    alksAccount: '012345678910',
                    alksRole: 'Admin',
                });
            }), getAwsAccountFromString: (account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910') {
                    return {
                        id: '012345678910',
                        alias: 'awstest123',
                        label: 'Test 123 - Prod',
                    };
                }
                throw new Error('no account found');
            }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when no account or role are provided', options: {}, resultAccount: {
                id: '012345678910',
                alias: 'awstest123',
                label: 'Test 123 - Prod',
            }, resultRole: 'Admin', promptForAlksAccountAndRole: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    alksAccount: '012345678910',
                    alksRole: 'Admin',
                });
            }), getAwsAccountFromString: (account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910') {
                    return {
                        id: '012345678910',
                        alias: 'awstest123',
                        label: 'Test 123 - Prod',
                    };
                }
                throw new Error('no account found');
            }) }),
    ];
    for (const t of testCases) {
        describe(t.description, () => {
            let result;
            let exception;
            beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                log_1.log.mockImplementation(t.log);
                tryToExtractRole_1.tryToExtractRole.mockImplementation(t.tryToExtractRole);
                promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockImplementation(t.promptForAlksAccountAndRole);
                getAwsAccountFromString_1.getAwsAccountFromString.mockImplementation(t.getAwsAccountFromString);
                try {
                    result = yield (0, extractAccountAndRole_1.extractAccountAndRole)(t.options);
                }
                catch (e) {
                    exception = e;
                }
            }));
            afterEach(() => {
                log_1.log.mockReset();
                tryToExtractRole_1.tryToExtractRole.mockReset();
                promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockReset();
                getAwsAccountFromString_1.getAwsAccountFromString.mockReset();
            });
            if (t.shouldThrow) {
                it('throws an exception', () => {
                    expect(exception).toBeInstanceOf(Error);
                });
            }
            else {
                it('returns the correct result', () => {
                    expect(result.awsAccount).toEqual(t.resultAccount);
                    expect(result.role).toEqual(t.resultRole);
                });
            }
        });
    }
});
//# sourceMappingURL=extractAccountAndRole.test.js.map