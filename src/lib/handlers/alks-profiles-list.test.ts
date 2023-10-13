import { managedBy } from '../awsCredentialsFileContstants';
import { getAllProfiles } from '../getAllProfiles';
import { handleAlksProfilesList } from './alks-profiles-list';

jest.mock('../getAllProfiles');

describe('handleAlksProfilesList', () => {
  beforeEach(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should list profiles', async () => {
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

    await handleAlksProfilesList({
      output: 'json',
    });

    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify([
        {
          name: 'profile1',
          [managedBy]: 'alks',
        },
        {
          name: 'profile2',
          [managedBy]: 'alks',
        },
      ])
    );
  });

  it('should list profiles when output format is text', async () => {
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

    await handleAlksProfilesList({
      output: 'list',
    });

    expect(console.log).toHaveBeenNthCalledWith(1, 'profile1');
    expect(console.log).toHaveBeenNthCalledWith(2, 'profile2');
  });

  it('should throw an error if the output format is invalid', async () => {
    await expect(
      handleAlksProfilesList({
        output: 'invalid',
      })
    ).rejects.toThrow('Invalid output type');
  });

  it('should print an error message if no profiles are found', async () => {
    (getAllProfiles as jest.Mock).mockReturnValue([]);

    handleAlksProfilesList({
      output: 'json',
    });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('No profiles found')
    );
  });

  it('should print a warning message if sensitive values are shown', async () => {
    (getAllProfiles as jest.Mock).mockReturnValue([
      {
        name: 'profile1',
        [managedBy]: 'alks',
      },
    ]);

    handleAlksProfilesList({
      output: 'json',
      showSensitiveValues: true,
    });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'WARNING: Sensitive values will be shown in output. Do not share this output with anyone.'
      )
    );
    expect(getAllProfiles).toHaveBeenCalledWith(undefined, true);
  });

  it('should show all profiles if the all flag is set', async () => {
    (getAllProfiles as jest.Mock).mockReturnValue([
      {
        name: 'profile1',
        [managedBy]: 'alks',
      },
      {
        name: 'profile2',
        [managedBy]: 'alks',
      },
      {
        name: 'profile3',
        [managedBy]: 'other',
      },
    ]);

    handleAlksProfilesList({
      output: 'json',
      all: true,
    });

    expect(getAllProfiles).toHaveBeenCalledWith(true, undefined);
  });
});
