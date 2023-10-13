import { closeSync, existsSync, mkdirSync, openSync } from 'fs';
import { getFilePathInHome } from './getFilePathInHome';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';

jest.mock('fs');
jest.mock('./getFilePathInHome');

describe('getAwsCredentialsFile', () => {
  const credPath = '/home/joebob/.aws';
  const credFile = credPath + '/credentials';

  beforeEach(() => {
    (getFilePathInHome as jest.Mock).mockReturnValue(credPath);
  });

  it('should return the cred file path', () => {
    (existsSync as jest.Mock).mockImplementation((path) => {
      switch (path) {
        case credPath:
          return true;
        case credFile:
          return true;
        default:
          return false;
      }
    });

    const file = getAwsCredentialsFile();

    expect(file).toEqual(credFile);
  });

  it('should make the cred file if it does not exist and return the cred file path', () => {
    (existsSync as jest.Mock).mockImplementation((path) => {
      switch (path) {
        case credPath:
          return true;
        case credFile:
          return false;
        default:
          return false;
      }
    });

    const file = getAwsCredentialsFile();

    expect(openSync).toHaveBeenCalledWith(credFile, expect.any(String));
    expect(closeSync).toHaveBeenCalled();
    expect(file).toEqual(credFile);
  });

  it('should make the cred file and folder if they do not exist and return the cred file path', () => {
    (existsSync as jest.Mock).mockImplementation((path) => {
      switch (path) {
        case credPath:
          return false;
        case credFile:
          return false;
        default:
          return false;
      }
    });

    const file = getAwsCredentialsFile();

    expect(mkdirSync).toHaveBeenCalledWith(credPath);
    expect(openSync).toHaveBeenCalledWith(credFile, expect.any(String));
    expect(closeSync).toHaveBeenCalled();
    expect(file).toEqual(credFile);
  });
});
