"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const awsCredentialsFileContstants_1 = require("../awsCredentialsFileContstants");
const getProfile_1 = require("../getProfile");
const alks_profiles_get_1 = require("./alks-profiles-get");
jest.mock('../getProfile');
describe('handleAlksProfilesGet', () => {
    beforeEach(() => {
        console.error = jest.fn();
        console.log = jest.fn();
    });
    it('should get a profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getProfile_1.getProfile.mockReturnValue({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        });
        yield (0, alks_profiles_get_1.handleAlksProfilesGet)({
            profile: 'profile1',
            output: 'json',
        });
        expect(console.log).toHaveBeenCalledWith(JSON.stringify({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        }));
    }));
    it('should get a profile when output format is text', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getProfile_1.getProfile.mockReturnValue({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        });
        yield (0, alks_profiles_get_1.handleAlksProfilesGet)({
            profile: 'profile1',
            output: 'text',
        });
        expect(console.log).toHaveBeenNthCalledWith(1, '[profile1]');
        expect(console.log).toHaveBeenNthCalledWith(2, `${awsCredentialsFileContstants_1.managedBy}=alks`);
    }));
    it('should throw an error if no profile is specified', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, alks_profiles_get_1.handleAlksProfilesGet)({})).rejects.toThrow('--profile is required');
        expect(getProfile_1.getProfile).not.toHaveBeenCalled();
    }));
    it('should throw an error if the profile does not exist', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getProfile_1.getProfile.mockReturnValue(undefined);
        expect(() => (0, alks_profiles_get_1.handleAlksProfilesGet)({
            profile: 'profile1',
            output: 'json',
        })).rejects.toThrow('Profile profile1 does not exist');
        expect(getProfile_1.getProfile).toHaveBeenCalledWith('profile1', undefined);
    }));
    it('should throw an error if the output type is invalid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getProfile_1.getProfile.mockReturnValue({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        });
        yield expect((0, alks_profiles_get_1.handleAlksProfilesGet)({
            profile: 'profile1',
            output: 'something',
        })).rejects.toThrow('Invalid output type');
        expect(getProfile_1.getProfile).toHaveBeenCalledWith('profile1', undefined);
    }));
    it('should show sensitive values if the showSensitiveValues flag is set', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getProfile_1.getProfile.mockReturnValue({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.accessKey]: 'accessKey1',
            [awsCredentialsFileContstants_1.secretKey]: 'secretKey1',
            [awsCredentialsFileContstants_1.sessionToken]: 'sessionToken1',
        });
        yield (0, alks_profiles_get_1.handleAlksProfilesGet)({
            profile: 'profile1',
            showSensitiveValues: true,
            output: 'json',
        });
        expect(getProfile_1.getProfile).toHaveBeenCalledWith('profile1', true);
        expect(console.log).toHaveBeenCalledWith(JSON.stringify({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.accessKey]: 'accessKey1',
            [awsCredentialsFileContstants_1.secretKey]: 'secretKey1',
            [awsCredentialsFileContstants_1.sessionToken]: 'sessionToken1',
        }));
    }));
    it('should get a profile when the profile is specified with --namedProfile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getProfile_1.getProfile.mockReturnValue({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        });
        yield (0, alks_profiles_get_1.handleAlksProfilesGet)({
            namedProfile: 'profile1',
            output: 'json',
        });
        expect(console.log).toHaveBeenCalledWith(JSON.stringify({
            name: 'profile1',
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        }));
    }));
});
//# sourceMappingURL=alks-profiles-get.test.js.map