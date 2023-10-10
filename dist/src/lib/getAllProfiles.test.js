"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
const getAllProfiles_1 = require("./getAllProfiles");
jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');
describe('getAllProfiles', () => {
    const propIni = {
        decode: jest.fn(),
        addData: jest.fn(),
        removeData: jest.fn(),
        encode: jest.fn(),
    };
    const fakeProfile = 'something';
    beforeEach(() => {
        getAwsCredentialsFile_1.getAwsCredentialsFile.mockReturnValue('some/path');
        prop_ini_1.createInstance.mockReturnValue(propIni);
    });
    it('should return all profiles managed by ALKS, hiding sensitive values', () => {
        propIni.decode.mockImplementation(() => ({
            sections: {
                [fakeProfile]: {
                    [awsCredentialsFileContstants_1.managedBy]: 'alks',
                    [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                    [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                    [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                },
            },
        }));
        const profiles = (0, getAllProfiles_1.getAllProfiles)();
        expect(profiles).toEqual([
            {
                name: fakeProfile,
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
                [awsCredentialsFileContstants_1.accessKey]: expect.any(String),
                [awsCredentialsFileContstants_1.secretKey]: expect.stringMatching(/.*\*\*\*\*/),
                [awsCredentialsFileContstants_1.sessionToken]: expect.stringMatching(/.*\*\*\*\*/),
            },
        ]);
    });
    it('should return all profiles managed by ALKS, showing sensitive values when showSensitiveValues is true', () => {
        propIni.decode.mockImplementation(() => ({
            sections: {
                [fakeProfile]: {
                    [awsCredentialsFileContstants_1.managedBy]: 'alks',
                    [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                    [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                    [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                },
            },
        }));
        const profiles = (0, getAllProfiles_1.getAllProfiles)(false, true);
        expect(profiles).toEqual([
            {
                name: fakeProfile,
                [awsCredentialsFileContstants_1.managedBy]: 'alks',
                [awsCredentialsFileContstants_1.accessKey]: expect.any(String),
                [awsCredentialsFileContstants_1.secretKey]: expect.stringMatching(/^\w+$/),
                [awsCredentialsFileContstants_1.sessionToken]: expect.stringMatching(/^\w+$/),
            },
        ]);
    });
    it('should return all profiles, even those not managed by ALKS, hiding sensitive values when includeNonAlksProfiles is true', () => {
        propIni.decode.mockImplementation(() => ({
            sections: {
                [fakeProfile]: {
                    [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                    [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                    [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                },
            },
        }));
        const profiles = (0, getAllProfiles_1.getAllProfiles)(true);
        expect(profiles).toEqual([
            {
                name: fakeProfile,
                [awsCredentialsFileContstants_1.accessKey]: expect.any(String),
                [awsCredentialsFileContstants_1.secretKey]: expect.stringMatching(/.*\*\*\*\*/),
                [awsCredentialsFileContstants_1.sessionToken]: expect.stringMatching(/.*\*\*\*\*/),
            },
        ]);
    });
});
//# sourceMappingURL=getAllProfiles.test.js.map