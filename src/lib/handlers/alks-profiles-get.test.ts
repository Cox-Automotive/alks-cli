import {
  accessKey,
  managedBy,
  secretKey,
  sessionToken,
} from '../awsCredentialsFileContstants';
import { getProfile } from '../getProfile';
import { handleAlksProfilesGet } from './alks-profiles-get';

jest.mock('../getProfile');

describe('handleAlksProfilesGet', () => {
  beforeEach(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should get a profile', async () => {
    (getProfile as jest.Mock).mockReturnValue({
      name: 'profile1',
      [managedBy]: 'alks',
    });

    await handleAlksProfilesGet({
      profile: 'profile1',
      output: 'json',
    });

    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        name: 'profile1',
        [managedBy]: 'alks',
      })
    );
  });

  it('should get a profile when output format is text', async () => {
    (getProfile as jest.Mock).mockReturnValue({
      name: 'profile1',
      [managedBy]: 'alks',
    });

    await handleAlksProfilesGet({
      profile: 'profile1',
      output: 'text',
    });

    expect(console.log).toHaveBeenNthCalledWith(1, '[profile1]');
    expect(console.log).toHaveBeenNthCalledWith(2, `${managedBy}=alks`);
  });

  it('should throw an error if no profile is specified', async () => {
    await expect(handleAlksProfilesGet({})).rejects.toThrow(
      '--profile is required'
    );

    expect(getProfile).not.toHaveBeenCalled();
  });

  it('should throw an error if the profile does not exist', async () => {
    (getProfile as jest.Mock).mockReturnValue(undefined);

    expect(() =>
      handleAlksProfilesGet({
        profile: 'profile1',
        output: 'json',
      })
    ).rejects.toThrow('Profile profile1 does not exist');

    expect(getProfile).toHaveBeenCalledWith('profile1', undefined);
  });

  it('should throw an error if the output type is invalid', async () => {
    (getProfile as jest.Mock).mockReturnValue({
      name: 'profile1',
      [managedBy]: 'alks',
    });

    await expect(
      handleAlksProfilesGet({
        profile: 'profile1',
        output: 'something',
      })
    ).rejects.toThrow('Invalid output type');

    expect(getProfile).toHaveBeenCalledWith('profile1', undefined);
  });

  it('should show sensitive values if the showSensitiveValues flag is set', async () => {
    (getProfile as jest.Mock).mockReturnValue({
      name: 'profile1',
      [managedBy]: 'alks',
      [accessKey]: 'accessKey1',
      [secretKey]: 'secretKey1',
      [sessionToken]: 'sessionToken1',
    });

    await handleAlksProfilesGet({
      profile: 'profile1',
      showSensitiveValues: true,
      output: 'json',
    });

    expect(getProfile).toHaveBeenCalledWith('profile1', true);

    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        name: 'profile1',
        [managedBy]: 'alks',
        [accessKey]: 'accessKey1',
        [secretKey]: 'secretKey1',
        [sessionToken]: 'sessionToken1',
      })
    );
  });

  it('should get a profile when the profile is specified with --namedProfile', async () => {
    (getProfile as jest.Mock).mockReturnValue({
      name: 'profile1',
      [managedBy]: 'alks',
    });

    await handleAlksProfilesGet({
      namedProfile: 'profile1',
      output: 'json',
    });

    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        name: 'profile1',
        [managedBy]: 'alks',
      })
    );
  });
});
