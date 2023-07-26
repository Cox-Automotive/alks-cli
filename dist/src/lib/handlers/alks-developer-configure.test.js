"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errorAndExit_1 = require("../errorAndExit");
const alks_developer_configure_1 = require("./alks-developer-configure");
const promptForServer_1 = require("../promptForServer");
const promptForUserId_1 = require("../promptForUserId");
const promptForPassword_1 = require("../promptForPassword");
const confirm_1 = require("../confirm");
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
const promptForOutputFormat_1 = require("../promptForOutputFormat");
const checkForUpdate_1 = require("../checkForUpdate");
const server_1 = require("../state/server");
const userId_1 = require("../state/userId");
const alksAccount_1 = require("../state/alksAccount");
const alksRole_1 = require("../state/alksRole");
const outputFormat_1 = require("../state/outputFormat");
const promptForAuthType_1 = require("../promptForAuthType");
const tabtab_1 = require("tabtab");
const password_1 = require("../state/password");
const promptForToken_1 = require("../promptForToken");
jest.mock('../state/server');
jest.mock('../state/userId');
jest.mock('../state/alksAccount');
jest.mock('../state/alksRole');
jest.mock('../state/outputFormat');
jest.mock('../state/password');
jest.mock('../errorAndExit');
jest.mock('../promptForServer');
jest.mock('../promptForUserId');
jest.mock('../promptForPassword');
jest.mock('../promptForToken');
jest.mock('../confirm');
jest.mock('../promptForAlksAccountAndRole');
jest.mock('../promptForOutputFormat');
jest.mock('../checkForUpdate');
jest.mock('../promptForAuthType', () => ({
    __esModule: true,
    REFRESH_TOKEN_AUTH_CHOICE: 'refresh-token',
    PASSWORD_AUTH_CHOICE: 'password',
    ALWAYS_ASK_AUTH_CHOICE: 'always-ask',
    promptForAuthType: jest.fn(),
}));
jest.mock('tabtab');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
describe('handleAlksDeveloperConfigure', () => {
    const defaultTestCase = {
        options: {},
        program: {},
        shouldErr: false,
        promptForServerFails: false,
        server: '',
        shouldSaveServer: false,
        promptForUserIdFails: false,
        userId: '',
        shouldSaveUserId: false,
        authType: promptForAuthType_1.PASSWORD_AUTH_CHOICE,
        promptForPasswordFails: false,
        password: '',
        confirmSavePasswordFails: false,
        savePassword: false,
        setPasswordFails: false,
        shouldSetPassword: false,
        promptForTokenFails: false,
        token: '',
        promptForAlksAccountAndRoleFails: false,
        alksAccount: '',
        alksRole: '',
        shouldSaveAlksAccount: false,
        shouldSaveAlksRole: false,
        promptForOutputFormatFails: false,
        outputFormat: '',
        shouldSaveOutputFormat: false,
        tabtabInstallFails: false,
        checkForUpdateFails: false,
    };
    const testCases = [
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when prompting for the server url fails', shouldErr: true, promptForServerFails: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when prompting for a username fails', shouldErr: true, server: 'https://alks.com/rest', promptForUserIdFails: true, shouldSaveServer: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when prompting for the password fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', promptForPasswordFails: true, shouldSaveServer: true, shouldSaveUserId: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when prompting for the token fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', authType: promptForAuthType_1.REFRESH_TOKEN_AUTH_CHOICE, promptForTokenFails: true, shouldSaveServer: true, shouldSaveUserId: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when the auth type is invalid', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', authType: 'just let me in', shouldSaveServer: true, shouldSaveUserId: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when confirming if the user wants to save password fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', confirmSavePasswordFails: true, shouldSaveServer: true, shouldSaveUserId: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when saving the password fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, setPasswordFails: true, shouldSaveServer: true, shouldSaveUserId: true, shouldSetPassword: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when getting the alks account fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, promptForAlksAccountAndRoleFails: true, shouldSaveServer: true, shouldSaveUserId: true, shouldSetPassword: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when prompting for the output format fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', promptForOutputFormatFails: true, shouldSaveServer: true, shouldSaveUserId: true, shouldSetPassword: true, shouldSaveAlksAccount: true, shouldSaveAlksRole: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when installing tab completion fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', shouldSaveServer: true, shouldSaveUserId: true, shouldSetPassword: true, shouldSaveAlksAccount: true, shouldSaveAlksRole: true, shouldSaveOutputFormat: true, tabtabInstallFails: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when checkForUpdate fails', shouldErr: true, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', checkForUpdateFails: true, shouldSaveServer: true, shouldSaveUserId: true, shouldSetPassword: true, shouldSaveAlksAccount: true, shouldSaveAlksRole: true, shouldSaveOutputFormat: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when everything succeeds', shouldErr: false, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', savePassword: true, alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', shouldSaveServer: true, shouldSaveUserId: true, shouldSetPassword: true, shouldSaveAlksAccount: true, shouldSaveAlksRole: true, shouldSaveOutputFormat: true }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when everything succeeds but the user declines saving password', shouldErr: false, server: 'https://alks.com/rest', userId: 'bobby', password: 'letmein', alksAccount: '012345678910/ALKSAdmin - awstest', alksRole: 'Admin', outputFormat: 'env', shouldSaveServer: true, shouldSaveUserId: true, shouldSaveAlksAccount: true, shouldSaveAlksRole: true, shouldSaveOutputFormat: true }),
    ];
    for (const t of testCases) {
        describe(t.description, () => {
            let errorThrown = false;
            beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                promptForServer_1.promptForServer.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.promptForServerFails) {
                        throw new Error();
                    }
                    else {
                        return t.server;
                    }
                }));
                promptForUserId_1.promptForUserId.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.promptForUserIdFails) {
                        throw new Error();
                    }
                    else {
                        return t.userId;
                    }
                }));
                promptForAuthType_1.promptForAuthType.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return t.authType; }));
                promptForPassword_1.promptForPassword.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.promptForPasswordFails) {
                        throw new Error();
                    }
                    else {
                        return t.password;
                    }
                }));
                promptForToken_1.promptForToken.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.promptForTokenFails) {
                        throw new Error();
                    }
                    else {
                        return t.token;
                    }
                }));
                confirm_1.confirm.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.confirmSavePasswordFails) {
                        throw new Error();
                    }
                    else {
                        return t.savePassword;
                    }
                }));
                password_1.setPassword.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.setPasswordFails) {
                        throw new Error();
                    }
                }));
                promptForAlksAccountAndRole_1.promptForAlksAccountAndRole.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.promptForAlksAccountAndRoleFails) {
                        throw new Error();
                    }
                    else {
                        return { alksAccount: t.alksAccount, alksRole: t.alksRole };
                    }
                }));
                promptForOutputFormat_1.promptForOutputFormat.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.promptForOutputFormatFails) {
                        throw new Error();
                    }
                    else {
                        return t.outputFormat;
                    }
                }));
                tabtab_1.install.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.tabtabInstallFails) {
                        throw new Error();
                    }
                }));
                checkForUpdate_1.checkForUpdate.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    if (t.checkForUpdateFails) {
                        throw new Error();
                    }
                }));
                errorAndExit_1.errorAndExit.mockImplementation(() => {
                    errorThrown = true;
                });
                process.stdin.isTTY = true;
                yield (0, alks_developer_configure_1.handleAlksDeveloperConfigure)(t.options);
            }));
            afterEach(() => {
                jest.resetAllMocks();
            });
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
            if (t.shouldSaveServer) {
                it('attempts to save the server url', () => {
                    expect(server_1.setServer).toBeCalledWith(t.server);
                });
            }
            if (t.shouldSaveUserId) {
                it('attempts to save the userid', () => {
                    expect(userId_1.setUserId).toBeCalledWith(t.userId);
                });
            }
            if (t.shouldSetPassword) {
                it('attempts to save password', () => {
                    expect(password_1.setPassword).toBeCalledWith(t.password);
                });
            }
            if (t.shouldSaveAlksAccount) {
                it('attempts to save the alks account', () => {
                    expect(alksAccount_1.setAlksAccount).toBeCalledWith(t.alksAccount);
                });
            }
            if (t.shouldSaveAlksRole) {
                it('attempts to save the alks role', () => {
                    expect(alksRole_1.setAlksRole).toBeCalledWith(t.alksRole);
                });
            }
            if (t.shouldSaveOutputFormat) {
                it('attempts to save the output format', () => {
                    expect(outputFormat_1.setOutputFormat).toBeCalledWith(t.outputFormat);
                });
            }
        });
    }
});
//# sourceMappingURL=alks-developer-configure.test.js.map