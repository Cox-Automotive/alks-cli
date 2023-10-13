"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const awsCredentialsFileContstants_1 = require("../awsCredentialsFileContstants");
const getAllProfiles_1 = require("../getAllProfiles");
const alks_profiles_list_1 = require("./alks-profiles-list");
jest.mock('../getAllProfiles');
describe('handleAlksProfilesList', () => {
    beforeEach(() => {
        console.error = jest.fn();
        console.log = jest.fn();
    });
    it('should list profiles', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, alks_profiles_list_1.handleAlksProfilesList)({
            output: 'json',
        });
        expect(console.log).toHaveBeenCalledWith(JSON.stringify([
            {
                name: 'profile1',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
            {
                name: 'profile2',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
        ]));
    }));
    it('should list profiles when output format is text', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, alks_profiles_list_1.handleAlksProfilesList)({
            output: 'list',
        });
        expect(console.log).toHaveBeenNthCalledWith(1, 'profile1');
        expect(console.log).toHaveBeenNthCalledWith(2, 'profile2');
    }));
    it('should throw an error if the output format is invalid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, alks_profiles_list_1.handleAlksProfilesList)({
            output: 'invalid',
        })).rejects.toThrow('Invalid output type');
    }));
    it('should print an error message if no profiles are found', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllProfiles_1.getAllProfiles.mockReturnValue([]);
        (0, alks_profiles_list_1.handleAlksProfilesList)({
            output: 'json',
        });
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('No profiles found'));
    }));
    it('should print a warning message if sensitive values are shown', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllProfiles_1.getAllProfiles.mockReturnValue([
            {
                name: 'profile1',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
        ]);
        (0, alks_profiles_list_1.handleAlksProfilesList)({
            output: 'json',
            showSensitiveValues: true,
        });
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('WARNING: Sensitive values will be shown in output. Do not share this output with anyone.'));
        expect(getAllProfiles_1.getAllProfiles).toHaveBeenCalledWith(undefined, true);
    }));
    it('should show all profiles if the all flag is set', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllProfiles_1.getAllProfiles.mockReturnValue([
            {
                name: 'profile1',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
            {
                name: 'profile2',
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
            },
            {
                name: 'profile3',
                [awsCredentialsFileContstants_1.managedBy]: 'other',
            },
        ]);
        (0, alks_profiles_list_1.handleAlksProfilesList)({
            output: 'json',
            all: true,
        });
        expect(getAllProfiles_1.getAllProfiles).toHaveBeenCalledWith(true, undefined);
    }));
});
//# sourceMappingURL=alks-profiles-list.test.js.map