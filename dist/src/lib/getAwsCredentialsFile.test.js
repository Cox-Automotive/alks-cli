"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const getFilePathInHome_1 = require("./getFilePathInHome");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
jest.mock('fs');
jest.mock('./getFilePathInHome');
describe('getAwsCredentialsFile', () => {
    const credPath = '/home/joebob/.aws';
    beforeEach(() => {
        getFilePathInHome_1.getFilePathInHome.mockReturnValue(credPath);
    });
    it('should return the cred file path', () => {
        fs_1.existsSync.mockImplementation((path) => {
            switch (path) {
                case credPath: return true;
                case credPath + '/credentials': return true;
                default: return false;
            }
        });
        const file = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
        expect(file).toEqual(credPath + '/credentials');
    });
});
//# sourceMappingURL=getAwsCredentialsFile.test.js.map