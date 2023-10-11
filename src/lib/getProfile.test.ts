import { createInstance } from 'prop-ini';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';
import {
  accessKey,
  managedBy,
  secretKey,
  sessionToken,
} from './awsCredentialsFileContstants';
import { getProfile } from './getProfile';

jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');

describe('getProfile', () => {
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

  it('should get the profile if it exists', () => {
    const section = {
      [managedBy]: 'alks',
      [accessKey]: 'abcdefghijklmnop',
      [secretKey]: 'abcdefghijklmnop',
      [sessionToken]: 'abcdefghijklmnop',
    };
    (propIni.decode as jest.Mock).mockReturnValue({
      sections: {
        [fakeProfile]: section,
      },
    });
    (propIni.getData as jest.Mock).mockImplementation((profileName) => {
      switch (profileName) {
        case fakeProfile:
          return section;
        default:
          return undefined;
      }
    });

    const result = getProfile(fakeProfile);

    expect(result).toEqual({
      name: fakeProfile,
      [managedBy]: 'alks',
      [accessKey]: 'abcdefghijklmnop',
      [secretKey]: expect.stringMatching(/.*\*\*\*\*/),
      [sessionToken]: expect.stringMatching(/.*\*\*\*\*/),
    });
  });

  it('should get return undefined if a profile does not exist', () => {
    (propIni.decode as jest.Mock).mockReturnValue({
      sections: {},
    });
    (propIni.getData as jest.Mock).mockReturnValue(undefined);

    const result = getProfile(fakeProfile);

    expect(result).toEqual(undefined);
  });

  it('should get the profile and print secrets if it exists and showSensitiveValues is true', () => {
    const section = {
      [managedBy]: 'alks',
      [accessKey]: 'abcdefghijklmnop',
      [secretKey]: 'abcdefghijklmnop',
      [sessionToken]: 'abcdefghijklmnop',
    };
    (propIni.decode as jest.Mock).mockReturnValue({
      sections: {
        [fakeProfile]: section,
      },
    });
    (propIni.getData as jest.Mock).mockImplementation((profileName) => {
      switch (profileName) {
        case fakeProfile:
          return section;
        default:
          return undefined;
      }
    });

    const result = getProfile(fakeProfile, true);

    expect(result).toEqual({
      name: fakeProfile,
      [managedBy]: 'alks',
      [accessKey]: 'abcdefghijklmnop',
      [secretKey]: expect.stringMatching(/^\w+$/),
      [sessionToken]: expect.stringMatching(/^\w+$/),
    });
  });
});
