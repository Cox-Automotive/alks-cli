"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const awsCredentialsFileContstants_1 = require("../awsCredentialsFileContstants");
const confirm_1 = require("../confirm");
const getAllProfiles_1 = require("../getAllProfiles");
const removeProfile_1 = require("../removeProfile");
const alks_profiles_remove_1 = require("./alks-profiles-remove");
jest.mock('../getAllProfiles');
jest.mock('../removeProfile');
jest.mock('../confirm');
describe('handleAlksProfilesRemove', () => {
    beforeEach(() => {
        console.error = jest.fn();
    });
    it('should remove all profiles', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllProfiles_1.getAllProfiles.mockReturnValue([
            {
                name: 'profile1',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
            {
                name: 'profile2',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
        ]);
        confirm_1.confirm.mockResolvedValue(true);
        yield (0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            all: true,
            force: true,
        });
        expect(removeProfile_1.removeProfile).toHaveBeenCalledTimes(2);
    }));
    it('should remove a single profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        confirm_1.confirm.mockResolvedValue(true);
        yield (0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            profile: 'profile1',
        });
        expect(removeProfile_1.removeProfile).toHaveBeenCalledWith('profile1', undefined);
    }));
    it('should throw an error if no profile or --all flag is specified', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, alks_profiles_remove_1.handleAlksProfilesRemove)({})).rejects.toThrow('Either --profile or --all is required');
        expect(removeProfile_1.removeProfile).not.toHaveBeenCalled();
    }));
    it('should throw an error if the user does not confirm', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        confirm_1.confirm.mockResolvedValue(false);
        yield expect((0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            profile: 'profile1',
        })).rejects.toThrow('Aborting');
        expect(removeProfile_1.removeProfile).not.toHaveBeenCalled();
    }));
    it('should throw an error if the user does not confirm for all profiles', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllProfiles_1.getAllProfiles.mockReturnValue([
            {
                name: 'profile1',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
            {
                name: 'profile2',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
        ]);
        confirm_1.confirm.mockResolvedValue(false);
        yield expect((0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            all: true,
        })).rejects.toThrow('Aborting');
        expect(removeProfile_1.removeProfile).not.toHaveBeenCalled();
    }));
    it('should remove a single profile when the user passes namedProfile instead of profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        confirm_1.confirm.mockResolvedValue(true);
        yield (0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            namedProfile: 'profile1',
        });
        expect(removeProfile_1.removeProfile).toHaveBeenCalledWith('profile1', undefined);
    }));
    it('should propagate the force flag when removing a single profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        confirm_1.confirm.mockResolvedValue(true);
        yield (0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            profile: 'profile1',
            force: true,
        });
        expect(removeProfile_1.removeProfile).toHaveBeenCalledWith('profile1', true);
    }));
    it('should propagate the force flag when removing all profiles', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllProfiles_1.getAllProfiles.mockReturnValue([
            {
                name: 'profile1',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
            {
                name: 'profile2',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
        ]);
        confirm_1.confirm.mockResolvedValue(true);
        yield (0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            all: true,
            force: true,
        });
        expect(removeProfile_1.removeProfile).toHaveBeenNthCalledWith(1, 'profile1', true);
        expect(removeProfile_1.removeProfile).toHaveBeenNthCalledWith(2, 'profile2', true);
    }));
    it('should not pluralize the word profile when removing a single profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllProfiles_1.getAllProfiles.mockReturnValue([
            {
                name: 'profile1',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
        ]);
        confirm_1.confirm.mockResolvedValue(true);
        yield (0, alks_profiles_remove_1.handleAlksProfilesRemove)({
            all: true,
        });
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('1 profile removed'));
    }));
});
//# sourceMappingURL=alks-profiles-remove.test.js.map