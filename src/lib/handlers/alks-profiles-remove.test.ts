import { managedBy } from '../awsCredentialsFileContstants';
import { confirm } from '../confirm';
import { getAllProfiles } from '../getAllProfiles';
import { removeProfile } from '../removeProfile';
import { handleAlksProfilesRemove } from './alks-profiles-remove';

jest.mock('../getAllProfiles');
jest.mock('../removeProfile');
jest.mock('../confirm');

describe('handleAlksProfilesRemove', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  it('should remove all profiles', async () => {
    (getAllProfiles as jest.Mock).mockReturnValue([
      {
        name: 'profile1',
        [managedBy]: 'alks',
      },
      {
        name: 'profile2',
        [managedBy]: 'alks',
      },
    ]);
    (confirm as jest.Mock).mockResolvedValue(true);

    await handleAlksProfilesRemove({
      all: true,
      force: true,
    });

    expect(removeProfile).toHaveBeenCalledTimes(2);
  });

  it('should remove a single profile', async () => {
    (confirm as jest.Mock).mockResolvedValue(true);

    await handleAlksProfilesRemove({
      profile: 'profile1',
    });

    expect(removeProfile).toHaveBeenCalledWith('profile1', undefined);
  });

  it('should throw an error if no profile or --all flag is specified', async () => {
    await expect(handleAlksProfilesRemove({})).rejects.toThrow(
      'Either --profile or --all is required'
    );

    expect(removeProfile).not.toHaveBeenCalled();
  });

  it('should throw an error if the user does not confirm', async () => {
    (confirm as jest.Mock).mockResolvedValue(false);

    await expect(
      handleAlksProfilesRemove({
        profile: 'profile1',
      })
    ).rejects.toThrow('Aborting');

    expect(removeProfile).not.toHaveBeenCalled();
  });

  it('should throw an error if the user does not confirm for all profiles', async () => {
    (getAllProfiles as jest.Mock).mockReturnValue([
      {
        name: 'profile1',
        [managedBy]: 'alks',
      },
      {
        name: 'profile2',
        [managedBy]: 'alks',
      },
    ]);
    (confirm as jest.Mock).mockResolvedValue(false);

    await expect(
      handleAlksProfilesRemove({
        all: true,
      })
    ).rejects.toThrow('Aborting');

    expect(removeProfile).not.toHaveBeenCalled();
  });

  it('should remove a single profile when the user passes namedProfile instead of profile', async () => {
    (confirm as jest.Mock).mockResolvedValue(true);

    await handleAlksProfilesRemove({
      namedProfile: 'profile1',
    });

    expect(removeProfile).toHaveBeenCalledWith('profile1', undefined);
  });

  it('should propagate the force flag when removing a single profile', async () => {
    (confirm as jest.Mock).mockResolvedValue(true);

    await handleAlksProfilesRemove({
      profile: 'profile1',
      force: true,
    });

    expect(removeProfile).toHaveBeenCalledWith('profile1', true);
  });

  it('should propagate the force flag when removing all profiles', async () => {
    (getAllProfiles as jest.Mock).mockReturnValue([
      {
        name: 'profile1',
        [managedBy]: 'alks',
      },
      {
        name: 'profile2',
        [managedBy]: 'alks',
      },
    ]);
    (confirm as jest.Mock).mockResolvedValue(true);

    await handleAlksProfilesRemove({
      all: true,
      force: true,
    });

    expect(removeProfile).toHaveBeenNthCalledWith(1, 'profile1', true);
    expect(removeProfile).toHaveBeenNthCalledWith(2, 'profile2', true);
  });

  it('should not pluralize the word profile when removing a single profile', async () => {
    (getAllProfiles as jest.Mock).mockReturnValue([
      {
        name: 'profile1',
        [managedBy]: 'alks',
      },
    ]);
    (confirm as jest.Mock).mockResolvedValue(true);

    await handleAlksProfilesRemove({
      all: true,
    });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('1 profile removed')
    );
  });
});
