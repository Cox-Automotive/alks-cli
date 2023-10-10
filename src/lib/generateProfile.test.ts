import { createInstance } from 'prop-ini';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';
import { credentialProcess, managedBy } from './awsCredentialsFileContstants';
import { generateProfile } from './generateProfile';

jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');

describe('generateProfile', () => {
  const propIni: ReturnType<typeof createInstance> = {
    decode: jest.fn(),
    addData: jest.fn(),
    removeData: jest.fn(),
    encode: jest.fn(),
  };

  const fakeAccountId = '012345678910';
  const fakeRole = 'Admin';
  const fakeProfile = 'something';

  beforeEach(() => {
    (getAwsCredentialsFile as jest.Mock).mockReturnValue('some/path');
    (createInstance as jest.Mock).mockReturnValue(propIni);
  });

  it('should generate a new profile when the profile does not exist', () => {
    propIni.decode.mockImplementation(() => ({
      sections: {},
    }));

    generateProfile(fakeAccountId, fakeRole, fakeProfile);

    expect(propIni.addData).toHaveBeenCalledWith(
      {
        [managedBy]: 'alks',
        [credentialProcess]: expect.any(String),
      },
      fakeProfile
    );
  });

  it('should generate a new profile when the profile does not exist and is not specified', () => {
    propIni.decode.mockImplementation(() => ({
      sections: {},
    }));

    generateProfile(fakeAccountId, fakeRole, undefined);

    expect(propIni.addData).toHaveBeenCalledWith(
      {
        [managedBy]: 'alks',
        [credentialProcess]: expect.any(String),
      },
      'default'
    );
  });

  it('should fail and require --force when the profile does exist', () => {
    propIni.decode.mockImplementation(() => ({
      sections: {
        [fakeProfile]: {},
      },
    }));

    expect(() => {
      generateProfile(fakeAccountId, fakeRole, fakeProfile);
    }).toThrow();
  });

  it('should generate a new profile when the profile does exist and --force is passed', () => {
    propIni.decode.mockImplementation(() => ({
      sections: {
        [fakeProfile]: {},
      },
    }));

    generateProfile(fakeAccountId, fakeRole, fakeProfile, true);

    expect(propIni.addData).toHaveBeenCalledWith(
      'alks',
      fakeProfile,
      managedBy
    );
  });
});
