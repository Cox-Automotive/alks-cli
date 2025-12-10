"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const alks_server_configure_1 = require("./alks-server-configure");
const errorAndExit_1 = require("../errorAndExit");
const getIamKey_1 = require("../getIamKey");
const saveMetadata_1 = require("../saveMetadata");
const checkForUpdate_1 = require("../checkForUpdate");
const tryToExtractRole_1 = require("../tryToExtractRole");
jest.mock('../errorAndExit');
jest.mock('../getIamKey');
jest.mock('../saveMetadata');
jest.mock('../checkForUpdate');
jest.mock('../tryToExtractRole');
jest.mock('../log');
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => { });
describe('handleAlksServerConfigure', () => {
    const defaultKey = {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'AKIAIOSFODNN7EXAMPLE',
        secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        sessionToken: 'token123',
    };
    beforeEach(() => {
        jest.clearAllMocks();
        getIamKey_1.getIamKey.mockResolvedValue(defaultKey);
        saveMetadata_1.saveMetadata.mockResolvedValue(undefined);
        checkForUpdate_1.checkForUpdate.mockResolvedValue(undefined);
        tryToExtractRole_1.tryToExtractRole.mockReturnValue(undefined);
    });
    describe('when account and role are provided', () => {
        it('should get IAM key with provided account and role', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(getIamKey_1.getIamKey).toHaveBeenCalledWith('012345678910/ALKSAdmin - awstest', 'Admin', undefined, false, false);
        }));
    });
    describe('when only account is provided', () => {
        it('should try to extract role from account string', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
            };
            tryToExtractRole_1.tryToExtractRole.mockReturnValue('Admin');
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(tryToExtractRole_1.tryToExtractRole).toHaveBeenCalledWith('012345678910/ALKSAdmin - awstest');
            expect(getIamKey_1.getIamKey).toHaveBeenCalledWith('012345678910/ALKSAdmin - awstest', 'Admin', undefined, false, false);
        }));
    });
    describe('when iam flag is set', () => {
        it('should pass true for iamOnly parameter', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                iam: true,
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(getIamKey_1.getIamKey).toHaveBeenCalledWith('012345678910/ALKSAdmin - awstest', 'Admin', undefined, false, true);
        }));
    });
    describe('when favorites flag is set', () => {
        it('should pass true for filterFavorites parameter', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
                favorites: true,
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(getIamKey_1.getIamKey).toHaveBeenCalledWith('012345678910/ALKSAdmin - awstest', 'Admin', undefined, true, false);
        }));
    });
    describe('when getIamKey succeeds', () => {
        it('should save metadata with correct values', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(saveMetadata_1.saveMetadata).toHaveBeenCalledWith({
                alksAccount: defaultKey.alksAccount,
                alksRole: defaultKey.alksRole,
                isIam: defaultKey.isIAM,
            });
        }));
        it('should check for updates', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(checkForUpdate_1.checkForUpdate).toHaveBeenCalled();
        }));
        it('should display success message', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Metadata has been saved'));
        }));
    });
    describe('when getIamKey fails', () => {
        it('should call errorAndExit', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Failed to get IAM key');
            getIamKey_1.getIamKey.mockRejectedValue(error);
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(errorAndExit_1.errorAndExit).toHaveBeenCalledWith(error);
        }));
    });
    describe('when saveMetadata fails', () => {
        it('should call errorAndExit with appropriate message', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Failed to save');
            saveMetadata_1.saveMetadata.mockRejectedValue(error);
            const options = {
                account: '012345678910/ALKSAdmin - awstest',
                role: 'Admin',
            };
            yield (0, alks_server_configure_1.handleAlksServerConfigure)(options);
            expect(errorAndExit_1.errorAndExit).toHaveBeenCalledWith('Unable to save metadata!', error);
        }));
    });
});
//# sourceMappingURL=alks-server-configure.test.js.map