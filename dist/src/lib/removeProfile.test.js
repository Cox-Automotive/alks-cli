"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
const removeProfile_1 = require("./removeProfile");
jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');
describe('removeProfile', () => {
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
    it('should remove the profile if it exists and is managed by alks', () => {
        propIni.getData.mockImplementation((profileName) => {
            switch (profileName) {
                case fakeProfile:
                    return {
                        [awsCredentialsFileContstants_1.managedBy]: 'alks',
                        [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                    };
                default:
                    return {};
            }
        });
        propIni.removeData.mockReturnValue(true);
        expect(() => (0, removeProfile_1.removeProfile)(fakeProfile)).not.toThrow();
        expect(propIni.removeData).toHaveBeenCalledWith(fakeProfile);
    });
    it('should fail to remove the profile if it exists and is not managed by alks', () => {
        propIni.getData.mockImplementation((profileName) => {
            switch (profileName) {
                case fakeProfile:
                    return {
                        [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                    };
                default:
                    return {};
            }
        });
        propIni.removeData.mockReturnValue(true);
        expect(() => (0, removeProfile_1.removeProfile)(fakeProfile)).toThrow();
        expect(propIni.removeData).not.toHaveBeenCalledWith(fakeProfile);
    });
    it('should remove the profile if it exists and is not managed by alks but force=true', () => {
        propIni.getData.mockImplementation((profileName) => {
            switch (profileName) {
                case fakeProfile:
                    return {
                        [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                    };
                default:
                    return {};
            }
        });
        propIni.removeData.mockReturnValue(true);
        expect(() => (0, removeProfile_1.removeProfile)(fakeProfile, true)).not.toThrow();
        expect(propIni.removeData).toHaveBeenCalledWith(fakeProfile);
    });
    it('should throw if the profile fails to be deleted', () => {
        propIni.getData.mockImplementation((profileName) => {
            switch (profileName) {
                case fakeProfile:
                    return {
                        [awsCredentialsFileContstants_1.managedBy]: 'alks',
                        [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                    };
                default:
                    return {};
            }
        });
        propIni.removeData.mockReturnValue(false);
        expect(() => (0, removeProfile_1.removeProfile)(fakeProfile)).toThrow();
        expect(propIni.removeData).toHaveBeenCalledWith(fakeProfile);
    });
    it('should remove the default profile if no profile name is passed', () => {
        propIni.getData.mockImplementation((profileName) => {
            switch (profileName) {
                case 'default':
                    return {
                        [awsCredentialsFileContstants_1.managedBy]: 'alks',
                        [awsCredentialsFileContstants_1.accessKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.secretKey]: 'abcdefghijklmnop',
                        [awsCredentialsFileContstants_1.sessionToken]: 'abcdefghijklmnop',
                    };
                default:
                    return {};
            }
        });
        propIni.removeData.mockReturnValue(true);
        expect(() => (0, removeProfile_1.removeProfile)(undefined)).not.toThrow();
        expect(propIni.removeData).toHaveBeenCalledWith('default');
    });
});
//# sourceMappingURL=removeProfile.test.js.map