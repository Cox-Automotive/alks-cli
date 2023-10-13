"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
const generateProfile_1 = require("./generateProfile");
jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');
describe('generateProfile', () => {
    const propIni = {
        decode: jest.fn(),
        addData: jest.fn(),
        removeData: jest.fn(),
        encode: jest.fn(),
    };
    const fakeAccountId = '012345678910';
    const fakeRole = 'Admin';
    const fakeProfile = 'something';
    beforeEach(() => {
        getAwsCredentialsFile_1.getAwsCredentialsFile.mockReturnValue('some/path');
        prop_ini_1.createInstance.mockReturnValue(propIni);
    });
    it('should generate a new profile when the profile does not exist', () => {
        propIni.decode.mockImplementation(() => ({
            sections: {},
        }));
        (0, generateProfile_1.generateProfile)(fakeAccountId, fakeRole, fakeProfile);
        expect(propIni.addData).toHaveBeenCalledWith({
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.credentialProcess]: expect.any(String),
        }, fakeProfile);
    });
    it('should generate a new profile when the profile does not exist and is not specified', () => {
        propIni.decode.mockImplementation(() => ({
            sections: {},
        }));
        (0, generateProfile_1.generateProfile)(fakeAccountId, fakeRole, undefined);
        expect(propIni.addData).toHaveBeenCalledWith({
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
            [awsCredentialsFileContstants_1.credentialProcess]: expect.any(String),
        }, 'default');
    });
    it('should fail and require --force when the profile does exist', () => {
        propIni.decode.mockImplementation(() => ({
            sections: {
                [fakeProfile]: {},
            },
        }));
        expect(() => {
            (0, generateProfile_1.generateProfile)(fakeAccountId, fakeRole, fakeProfile);
        }).toThrow();
    });
    it('should generate a new profile when the profile does exist and --force is passed', () => {
        propIni.decode.mockImplementation(() => ({
            sections: {
                [fakeProfile]: {},
            },
        }));
        (0, generateProfile_1.generateProfile)(fakeAccountId, fakeRole, fakeProfile, true);
        expect(propIni.addData).toHaveBeenCalledWith('alks', fakeProfile, awsCredentialsFileContstants_1.managedBy);
    });
});
//# sourceMappingURL=generateProfile.test.js.map