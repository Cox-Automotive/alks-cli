import { createInstance } from 'prop-ini';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';
import {
  accessKey,
  managedBy,
  secretKey,
  sessionToken,
} from './awsCredentialsFileContstants';
import { getAllProfiles } from './getAllProfiles';

jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');

describe('getAllProfiles', () => {
  const propIni: ReturnType<typeof createInstance> = {
    decode: jest.fn(),
    addData: jest.fn(),
    removeData: jest.fn(),
    encode: jest.fn(),
  };

  const fakeProfile = 'something';

  beforeEach(() => {
    (getAwsCredentialsFile as jest.Mock).mockReturnValue('some/path');
    (createInstance as jest.Mock).mockReturnValue(propIni);
  });

  it('should return all profiles managed by ALKS, hiding sensitive values', () => {
    propIni.decode.mockImplementation(() => ({
      sections: {
        [fakeProfile]: {
          [managedBy]: 'alks',
          [accessKey]: 'abcdefghijklmnop',
          [secretKey]: 'abcdefghijklmnop',
          [sessionToken]: 'abcdefghijklmnop',
        },
      },
    }));

    const profiles = getAllProfiles();

    expect(profiles).toEqual([
      {
        name: fakeProfile,
        [managedBy]: 'alks',
        [accessKey]: expect.any(String),
        [secretKey]: expect.stringMatching(/.*\*\*\*\*/),
        [sessionToken]: expect.stringMatching(/.*\*\*\*\*/),
      },
    ]);
  });

  it('should return all profiles managed by ALKS, showing sensitive values when showSensitiveValues is true', () => {
    propIni.decode.mockImplementation(() => ({
      sections: {
        [fakeProfile]: {
          [managedBy]: 'alks',
          [accessKey]: 'abcdefghijklmnop',
          [secretKey]: 'abcdefghijklmnop',
          [sessionToken]: 'abcdefghijklmnop',
        },
      },
    }));

    const profiles = getAllProfiles(false, true);

    expect(profiles).toEqual([
      {
        name: fakeProfile,
        [managedBy]: 'alks',
        [accessKey]: expect.any(String),
        [secretKey]: expect.stringMatching(/^\w+$/),
        [sessionToken]: expect.stringMatching(/^\w+$/),
      },
    ]);
  });

  it('should return all profiles, even those not managed by ALKS, hiding sensitive values when includeNonAlksProfiles is true', () => {
    propIni.decode.mockImplementation(() => ({
      sections: {
        [fakeProfile]: {
          [accessKey]: 'abcdefghijklmnop',
          [secretKey]: 'abcdefghijklmnop',
          [sessionToken]: 'abcdefghijklmnop',
        },
      },
    }));

    const profiles = getAllProfiles(true);

    expect(profiles).toEqual([
      {
        name: fakeProfile,
        [accessKey]: expect.any(String),
        [secretKey]: expect.stringMatching(/.*\*\*\*\*/),
        [sessionToken]: expect.stringMatching(/.*\*\*\*\*/),
      },
    ]);
  });
});
