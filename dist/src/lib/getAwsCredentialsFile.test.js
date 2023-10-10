"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const getFilePathInHome_1 = require("./getFilePathInHome");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
jest.mock('fs');
jest.mock('./getFilePathInHome');
describe('getAwsCredentialsFile', () => {
    const credPath = '/home/joebob/.aws';
    const credFile = credPath + '/credentials';
    beforeEach(() => {
        getFilePathInHome_1.getFilePathInHome.mockReturnValue(credPath);
    });
    it('should return the cred file path', () => {
        fs_1.existsSync.mockImplementation((path) => {
            switch (path) {
                case credPath:
                    return true;
                case credFile:
                    return true;
                default:
                    return false;
            }
        });
        const file = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
        expect(file).toEqual(credFile);
    });
    it('should make the cred file if it does not exist and return the cred file path', () => {
        fs_1.existsSync.mockImplementation((path) => {
            switch (path) {
                case credPath:
                    return true;
                case credFile:
                    return false;
                default:
                    return false;
            }
        });
        const file = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
        expect(fs_1.openSync).toHaveBeenCalledWith(credFile, expect.any(String));
        expect(fs_1.closeSync).toHaveBeenCalled();
        expect(file).toEqual(credFile);
    });
    it('should make the cred file and folder if they do not exist and return the cred file path', () => {
        fs_1.existsSync.mockImplementation((path) => {
            switch (path) {
                case credPath:
                    return false;
                case credFile:
                    return false;
                default:
                    return false;
            }
        });
        const file = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
        expect(fs_1.mkdirSync).toHaveBeenCalledWith(credPath);
        expect(fs_1.openSync).toHaveBeenCalledWith(credFile, expect.any(String));
        expect(fs_1.closeSync).toHaveBeenCalled();
        expect(file).toEqual(credFile);
    });
});
//# sourceMappingURL=getAwsCredentialsFile.test.js.map