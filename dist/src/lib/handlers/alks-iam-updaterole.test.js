"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const log_1 = require("../log");
const unpackTags_1 = require("../unpackTags");
const extractAccountAndRole_1 = require("../extractAccountAndRole");
const alks_iam_updaterole_1 = require("./alks-iam-updaterole");
jest.mock('../errorAndExit', () => ({
    __esModule: true,
    errorAndExit: jest.fn(),
}));
jest.mock('../checkForUpdate', () => ({
    __esModule: true,
    checkForUpdate: jest.fn(),
}));
jest.mock('../getAuth', () => ({
    __esModule: true,
    getAuth: jest.fn(),
}));
jest.mock('../getAlks', () => ({
    __esModule: true,
    getAlks: jest.fn(),
}));
jest.mock('../log', () => ({
    __esModule: true,
    log: jest.fn(),
}));
jest.mock('../unpackTags', () => ({
    __esModule: true,
    unpackTags: jest.fn(),
}));
jest.mock('../extractAccountAndRole', () => ({
    __esModule: true,
    extractAccountAndRole: jest.fn(),
}));
describe('handleAlksIamUpdateRole', () => {
    const mockAlks = {
        updateRole: jest.fn(),
    };
    const testCaseDefaults = {
        shouldExitWithFailure: false,
        errorAndExit: jest.fn(() => {
            throw new Error('exit');
        }),
        unpackTags: jest.fn(),
        extractAccountAndRole: jest.fn(),
        getAuth: jest.fn(),
        updateRole: jest.fn(),
        log: jest.fn(),
        checkForUpdate: jest.fn(),
    };
    const testCases = [
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when all necessary fields as well as a trust policy and tags are provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
                tags: ['key=value'],
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                trustPolicy: {},
                tags: [
                    {
                        key: 'key',
                        value: 'value',
                    },
                ],
            }, unpackTags: (tags) => {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({}); }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when all necessary fields and a trust policy but no tags are provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                trustPolicy: {},
            }, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({}); }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when all necessary fields as well as tags but no trust policy is provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                tags: ['key=value'],
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                tags: [
                    {
                        key: 'key',
                        value: 'value',
                    },
                ],
            }, unpackTags: (tags) => {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({}); }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when all necessary fields but no trust policy or tags are provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
            }, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({}); }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when no role name is provided', options: {
                account: '012345678910',
                role: 'Admin',
            }, shouldExitWithFailure: true, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({}); }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when an invalid trust policy is provided', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{thisisnotvalidJSON',
            }, shouldExitWithFailure: true, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({}); }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when no auth is found', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
                tags: ['key=value'],
            }, shouldExitWithFailure: true, unpackTags: (tags) => {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw new Error('no auth');
            }) }),
        Object.assign(Object.assign({}, testCaseDefaults), { description: 'when the alks sdk fails to update the role', options: {
                account: '012345678910',
                role: 'Admin',
                rolename: 'myTestRole',
                trustPolicy: '{}',
                tags: ['key=value'],
            }, updateRoleParameters: {
                account: '012345678910',
                role: 'Admin',
                roleName: 'myTestRole',
                trustPolicy: {},
                tags: [
                    {
                        key: 'key',
                        value: 'value',
                    },
                ],
            }, shouldExitWithFailure: true, unpackTags: (tags) => {
                if (tags.length > 0 && tags[0] === 'key=value') {
                    return [
                        {
                            key: 'key',
                            value: 'value',
                        },
                    ];
                }
                throw new Error('incorrect tags');
            }, extractAccountAndRole: ({ account, role }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (account === '012345678910' && role === 'Admin') {
                    return {
                        awsAccount: {
                            id: '012345678910',
                            alias: 'awstest123',
                            label: 'Test 123 - Prod',
                        },
                        role: 'Admin',
                    };
                }
                throw new Error('failed to extract account and role');
            }), getAuth: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({}); }), updateRole: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw new Error('error updating role');
            }) }),
    ];
    for (const t of testCases) {
        describe(t.description, () => {
            beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                errorAndExit_1.errorAndExit.mockImplementation(t.errorAndExit);
                unpackTags_1.unpackTags.mockImplementation(t.unpackTags);
                extractAccountAndRole_1.extractAccountAndRole.mockImplementation(t.extractAccountAndRole);
                getAuth_1.getAuth.mockImplementation(t.getAuth);
                getAlks_1.getAlks.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return mockAlks; }));
                mockAlks.updateRole.mockImplementation(t.updateRole);
                log_1.log.mockImplementation(t.log);
                checkForUpdate_1.checkForUpdate.mockImplementation(t.checkForUpdate);
                try {
                    yield (0, alks_iam_updaterole_1.handleAlksIamUpdateRole)(t.options);
                }
                catch (_a) { }
            }));
            afterEach(() => {
                errorAndExit_1.errorAndExit.mockReset();
                unpackTags_1.unpackTags.mockReset();
                extractAccountAndRole_1.extractAccountAndRole.mockReset();
                getAuth_1.getAuth.mockReset();
                getAlks_1.getAlks.mockReset();
                log_1.log.mockReset();
                checkForUpdate_1.checkForUpdate.mockReset();
            });
            if (t.shouldExitWithFailure) {
                it('exits early with an error', () => {
                    expect(errorAndExit_1.errorAndExit).toBeCalled();
                });
            }
            else {
                it('should execute without error', () => {
                    expect(errorAndExit_1.errorAndExit).not.toHaveBeenCalled();
                });
                it('should call alks.updateRole with the correct parameters', () => {
                    expect(mockAlks.updateRole).toHaveBeenCalledWith(t.updateRoleParameters);
                });
                it('should check for updates', () => {
                    expect(checkForUpdate_1.checkForUpdate).toHaveBeenCalled();
                });
            }
        });
    }
});
//# sourceMappingURL=alks-iam-updaterole.test.js.map