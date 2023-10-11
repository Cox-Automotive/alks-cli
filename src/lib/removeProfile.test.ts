import { createInstance } from 'prop-ini';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';
import {
  accessKey,
  managedBy,
  secretKey,
  sessionToken,
} from './awsCredentialsFileContstants';
import { removeProfile } from './removeProfile';

jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');

describe('removeProfile', () => {
  const propIni: ReturnType<typeof createInstance> = {
    decode: jest.fn(),
    addData: jest.fn(),
    removeData: jest.fn(),
    encode: jest.fn(),
    getData: jest.fn(),
  };

  const fakeProfile = 'something';

  beforeEach(() => {
    (getAwsCredentialsFile as jest.Mock).mockReturnValue('some/path');
    (createInstance as jest.Mock).mockReturnValue(propIni);
  });

  it('should remove the profile if it exists and is managed by alks', () => {
    (propIni.getData as jest.Mock).mockImplementation((profileName) => {
      switch (profileName) {
        case fakeProfile:
          return {
            [managedBy]: 'alks',
            [accessKey]: 'abcdefghijklmnop',
            [secretKey]: 'abcdefghijklmnop',
            [sessionToken]: 'abcdefghijklmnop',
          };
        default:
          return {};
      }
    });
    (propIni.removeData as jest.Mock).mockReturnValue(true);

    expect(() => removeProfile(fakeProfile)).not.toThrow();

    expect(propIni.removeData).toHaveBeenCalledWith(fakeProfile);
  });

  it('should fail to remove the profile if it exists and is not managed by alks', () => {
    (propIni.getData as jest.Mock).mockImplementation((profileName) => {
      switch (profileName) {
        case fakeProfile:
          return {
            [accessKey]: 'abcdefghijklmnop',
            [secretKey]: 'abcdefghijklmnop',
            [sessionToken]: 'abcdefghijklmnop',
          };
        default:
          return {};
      }
    });
    (propIni.removeData as jest.Mock).mockReturnValue(true);

    expect(() => removeProfile(fakeProfile)).toThrow();

    expect(propIni.removeData).not.toHaveBeenCalledWith(fakeProfile);
  });

  it('should remove the profile if it exists and is not managed by alks but force=true', () => {
    (propIni.getData as jest.Mock).mockImplementation((profileName) => {
      switch (profileName) {
        case fakeProfile:
          return {
            [accessKey]: 'abcdefghijklmnop',
            [secretKey]: 'abcdefghijklmnop',
            [sessionToken]: 'abcdefghijklmnop',
          };
        default:
          return {};
      }
    });
    (propIni.removeData as jest.Mock).mockReturnValue(true);

    expect(() => removeProfile(fakeProfile, true)).not.toThrow();

    expect(propIni.removeData).toHaveBeenCalledWith(fakeProfile);
  });

  it('should throw if the profile fails to be deleted', () => {
    (propIni.getData as jest.Mock).mockImplementation((profileName) => {
      switch (profileName) {
        case fakeProfile:
          return {
            [managedBy]: 'alks',
            [accessKey]: 'abcdefghijklmnop',
            [secretKey]: 'abcdefghijklmnop',
            [sessionToken]: 'abcdefghijklmnop',
          };
        default:
          return {};
      }
    });
    (propIni.removeData as jest.Mock).mockReturnValue(false);

    expect(() => removeProfile(fakeProfile)).toThrow();

    expect(propIni.removeData).toHaveBeenCalledWith(fakeProfile);
  });

  it('should remove the default profile if no profile name is passed', () => {
    (propIni.getData as jest.Mock).mockImplementation((profileName) => {
      switch (profileName) {
        case 'default':
          return {
            [managedBy]: 'alks',
            [accessKey]: 'abcdefghijklmnop',
            [secretKey]: 'abcdefghijklmnop',
            [sessionToken]: 'abcdefghijklmnop',
          };
        default:
          return {};
      }
    });
    (propIni.removeData as jest.Mock).mockReturnValue(true);

    expect(() => removeProfile(undefined)).not.toThrow();

    expect(propIni.removeData).toHaveBeenCalledWith('default');
  });
});
