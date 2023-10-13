"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const generateProfile_1 = require("../generateProfile");
const getAlksAccounts_1 = require("../getAlksAccounts");
const alks_profiles_generate_1 = require("./alks-profiles-generate");
jest.mock('../generateProfile');
jest.mock('../getAlksAccounts');
describe('handleAlksProfilesGenerate', () => {
    const fakeAccountId = '123456789012';
    const fakeAlias = 'fakeAlias';
    const fakeRole = 'Admin';
    const fakeProfile = 'fakeProfile';
    let accounts = [];
    beforeEach(() => {
        accounts = [];
        console.error = jest.fn();
        getAlksAccounts_1.getAlksAccounts.mockResolvedValue(accounts);
    });
    it('should generate profiles for a single account when account and role are provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            account: fakeAccountId,
            role: fakeRole,
            profile: fakeProfile,
        });
        expect(generateProfile_1.generateProfile).toHaveBeenCalledWith(fakeAccountId, fakeRole, fakeProfile, undefined);
    }));
    it('should generate profiles for a single account when namedProfile is used instead of profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            account: fakeAccountId,
            role: fakeRole,
            namedProfile: fakeProfile,
        });
        expect(generateProfile_1.generateProfile).toHaveBeenCalledWith(fakeAccountId, fakeRole, fakeProfile, undefined);
    }));
    it('should propagate the force flag for generating a single profile when force=true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            account: fakeAccountId,
            role: fakeRole,
            profile: fakeProfile,
            force: true,
        });
        expect(generateProfile_1.generateProfile).toHaveBeenCalledWith(fakeAccountId, fakeRole, fakeProfile, true);
    }));
    it('should fail to generate a single profile when role is not provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            account: fakeAccountId,
            profile: fakeProfile,
        })).rejects.toThrow();
        expect(generateProfile_1.generateProfile).not.toHaveBeenCalled();
    }));
    it('should generate profiles for all accounts when all=true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        accounts.push({
            account: fakeAccountId,
            role: fakeRole,
            skypieaAccount: {
                label: 'Fake Label',
                alias: fakeAlias,
                accountOwners: [],
                cloudsploitTrend: [],
                awsAccountId: fakeAccountId,
            },
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        }, {
            account: fakeAccountId,
            role: 'ReadOnly',
            skypieaAccount: {
                label: 'Fake Label',
                alias: fakeAlias,
                accountOwners: [],
                cloudsploitTrend: [],
                awsAccountId: fakeAccountId,
            },
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        });
        yield (0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            all: true,
        });
        expect(generateProfile_1.generateProfile).toHaveBeenNthCalledWith(1, fakeAlias, fakeRole, `${fakeAlias}-${fakeRole}`, undefined);
        expect(generateProfile_1.generateProfile).toHaveBeenNthCalledWith(2, fakeAlias, 'ReadOnly', `${fakeAlias}-ReadOnly`, undefined);
    }));
    it('should throw an error when all=true and getAlksAccounts throws an error', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAlksAccounts_1.getAlksAccounts.mockRejectedValue(new Error('Fake Error'));
        yield expect((0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            all: true,
        })).rejects.toThrow();
        expect(generateProfile_1.generateProfile).not.toHaveBeenCalled();
    }));
    it('should log an error when all=true and generateProfile throws an error', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        accounts.push({
            account: fakeAccountId,
            role: fakeRole,
            skypieaAccount: {
                label: 'Fake Label',
                alias: fakeAlias,
                accountOwners: [],
                cloudsploitTrend: [],
                awsAccountId: fakeAccountId,
            },
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        }, {
            account: fakeAccountId,
            role: 'ReadOnly',
            skypieaAccount: {
                label: 'Fake Label',
                alias: fakeAlias,
                accountOwners: [],
                cloudsploitTrend: [],
                awsAccountId: fakeAccountId,
            },
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        });
        generateProfile_1.generateProfile.mockImplementationOnce(() => {
            throw new Error('Fake Error');
        });
        yield (0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            all: true,
        });
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Fake Error'));
    }));
    it('should log the number of profiles generated when all=true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        accounts.push({
            account: fakeAccountId,
            role: fakeRole,
            skypieaAccount: {
                label: 'Fake Label',
                alias: fakeAlias,
                accountOwners: [],
                cloudsploitTrend: [],
                awsAccountId: fakeAccountId,
            },
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        }, {
            account: fakeAccountId,
            role: 'ReadOnly',
            skypieaAccount: {
                label: 'Fake Label',
                alias: fakeAlias,
                accountOwners: [],
                cloudsploitTrend: [],
                awsAccountId: fakeAccountId,
            },
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        });
        yield (0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            all: true,
        });
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('2 profiles generated'));
    }));
    it('should generate profiles for all accounts even when skypiea data is missing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        accounts.push({
            account: fakeAccountId,
            role: fakeRole,
            skypieaAccount: {
                label: 'Fake Label',
                alias: fakeAlias,
                accountOwners: [],
                cloudsploitTrend: [],
                awsAccountId: fakeAccountId,
            },
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        }, {
            account: `${fakeAccountId}/ALKSReadOnly - ${fakeAlias}`,
            role: 'ReadOnly',
            skypieaAccount: null,
            securityLevel: '1',
            iamKeyActive: false,
            maxKeyDuration: 1,
        });
        yield (0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            all: true,
        });
        expect(generateProfile_1.generateProfile).toHaveBeenNthCalledWith(1, fakeAlias, fakeRole, `${fakeAlias}-${fakeRole}`, undefined);
        expect(generateProfile_1.generateProfile).toHaveBeenNthCalledWith(2, fakeAccountId, 'ReadOnly', `${fakeAccountId}-ReadOnly`, undefined);
    }));
    it('should throw an error when neither all nor account are provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, alks_profiles_generate_1.handleAlksProfilesGenerate)({
            profile: fakeProfile,
        })).rejects.toThrow();
        expect(generateProfile_1.generateProfile).not.toHaveBeenCalled();
    }));
});
//# sourceMappingURL=alks-profiles-generate.test.js.map