"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
const getProfile_1 = require("./getProfile");
jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');
describe('getProfile', () => {
    const propIni = {
        decode: jest.fn(),
        addData: jest.fn(),
        removeData: jest.fn(),
        encode: jest.fn(),
        getData: jest.fn(),
    };
    const fakeProfile = 'something';
    beforeEach(() => {
        getAwsCredentialsFile_1.getAwsCredentialsFile.mockReturnValue('some/path');
        prop_ini_1.createInstance.mockReturnValue(propIni);
    });
    it('should get the profile if it exists', () => {
        const section = {
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
            [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
            [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
        };
        propIni.decode.mockReturnValue({
            sections: {
                [fakeProfile]: section,
            },
        });
        propIni.getData.mockImplementation((profileName) => {
            switch (profileName) {
                case fakeProfile:
                    return section;
                default:
                    return undefined;
            }
        });
        const result = (0, getProfile_1.getProfile)(fakeProfile);
        expect(result).toEqual({
            name: fakeProfile,
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
            [awsCredentialsFileContstants_1.secretKey]: expect.stringMatching(/.*\*\*\*\*/),
            [awsCredentialsFileContstants_1.sessionToken]: expect.stringMatching(/.*\*\*\*\*/),
        });
    });
    it('should get return undefined if a profile does not exist', () => {
        propIni.decode.mockReturnValue({
            sections: {},
        });
        propIni.getData.mockReturnValue(undefined);
        const result = (0, getProfile_1.getProfile)(fakeProfile);
        expect(result).toEqual(undefined);
    });
    it('should get the profile and print secrets if it exists and showSensitiveValues is true', () => {
        const section = {
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
            [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
            [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
        };
        propIni.decode.mockReturnValue({
            sections: {
                [fakeProfile]: section,
            },
        });
        propIni.getData.mockImplementation((profileName) => {
            switch (profileName) {
                case fakeProfile:
                    return section;
                default:
                    return undefined;
            }
        });
        const result = (0, getProfile_1.getProfile)(fakeProfile, true);
        expect(result).toEqual({
            name: fakeProfile,
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
            [awsCredentialsFileContstants_1.secretKey]: expect.stringMatching(/^\w+$/),
            [awsCredentialsFileContstants_1.sessionToken]: expect.stringMatching(/^\w+$/),
        });
    });
});
//# sourceMappingURL=getProfile.test.js.map