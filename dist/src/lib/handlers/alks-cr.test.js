"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const alks_cr_1 = require("./alks-cr");
const getAlksModule = tslib_1.__importStar(require("../getAlks"));
const getAuthModule = tslib_1.__importStar(require("../getAuth"));
const getAwsAccountFromStringModule = tslib_1.__importStar(require("../getAwsAccountFromString"));
const promptForAlksAccountAndRoleModule = tslib_1.__importStar(require("../promptForAlksAccountAndRole"));
describe('handleAlksCr', () => {
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    const mockErrorAndExit = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        jest
            .spyOn(require('../errorAndExit'), 'errorAndExit')
            .mockImplementation(mockErrorAndExit);
    });
    it('should error if no CR number is provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, alks_cr_1.handleAlksCr)({});
        expect(mockErrorAndExit).toHaveBeenCalledWith('Please provide a Change Request number using --cr <crNumber>');
    }));
    it('should prompt for account/role if not provided and call alks.getIAMKeys', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const fakeAuth = { token: 't' };
        const fakeAlks = {
            getIAMKeys: jest.fn().mockResolvedValue({ key: 'val' }),
        };
        const fakeAwsAccount = { id: '123' };
        jest.spyOn(getAuthModule, 'getAuth').mockResolvedValue(fakeAuth);
        jest.spyOn(getAlksModule, 'getAlks').mockResolvedValue(fakeAlks);
        jest
            .spyOn(getAwsAccountFromStringModule, 'getAwsAccountFromString')
            .mockResolvedValue(fakeAwsAccount);
        jest
            .spyOn(promptForAlksAccountAndRoleModule, 'promptForAlksAccountAndRole')
            .mockResolvedValue({ alksAccount: 'acc', alksRole: 'role' });
        yield (0, alks_cr_1.handleAlksCr)({ cr: 'CR123' });
        expect(fakeAlks.getIAMKeys).toHaveBeenCalledWith({
            account: '123',
            role: 'role',
            sessionTime: 1,
            changeRequestNumber: 'CR123',
        });
        expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('CR operation result:'));
    }));
    it('should use provided account/role and sessionTime', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const fakeAuth = { token: 't' };
        const fakeAlks = {
            getIAMKeys: jest.fn().mockResolvedValue({ key: 'val' }),
        };
        const fakeAwsAccount = { id: '123' };
        jest.spyOn(getAuthModule, 'getAuth').mockResolvedValue(fakeAuth);
        jest.spyOn(getAlksModule, 'getAlks').mockResolvedValue(fakeAlks);
        jest
            .spyOn(getAwsAccountFromStringModule, 'getAwsAccountFromString')
            .mockResolvedValue(fakeAwsAccount);
        yield (0, alks_cr_1.handleAlksCr)({
            cr: 'CR123',
            account: 'acc',
            role: 'role',
            sessionTime: 2,
        });
        expect(fakeAlks.getIAMKeys).toHaveBeenCalledWith({
            account: '123',
            role: 'role',
            sessionTime: 2,
            changeRequestNumber: 'CR123',
        });
    }));
    it('should pass workloadId if provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const fakeAuth = { token: 't' };
        const fakeAlks = {
            getIAMKeys: jest.fn().mockResolvedValue({ key: 'val' }),
        };
        const fakeAwsAccount = { id: '123' };
        jest.spyOn(getAuthModule, 'getAuth').mockResolvedValue(fakeAuth);
        jest.spyOn(getAlksModule, 'getAlks').mockResolvedValue(fakeAlks);
        jest
            .spyOn(getAwsAccountFromStringModule, 'getAwsAccountFromString')
            .mockResolvedValue(fakeAwsAccount);
        yield (0, alks_cr_1.handleAlksCr)({
            cr: 'CR123',
            account: 'acc',
            role: 'role',
            sessionTime: 2,
            workloadId: 'wl-abc',
        });
        expect(fakeAlks.getIAMKeys).toHaveBeenCalledWith({
            account: '123',
            role: 'role',
            sessionTime: 2,
            changeRequestNumber: 'CR123',
            workloadId: 'wl-abc',
        });
    }));
});
//# sourceMappingURL=alks-cr.test.js.map