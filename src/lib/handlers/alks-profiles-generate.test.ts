import { generateProfile } from '../generateProfile';
import { getAlksAccounts } from '../getAlksAccounts';
import ALKS from 'alks.js';
import { handleAlksProfilesGenerate } from './alks-profiles-generate';

jest.mock('../generateProfile');
jest.mock('../getAlksAccounts');

describe('handleAlksProfilesGenerate', () => {
  const fakeAccountId = '123456789012';
  const fakeAlias = 'fakeAlias';
  const fakeRole = 'Admin';
  const fakeProfile = 'fakeProfile';

  let accounts: ALKS.Account[] = [];

  beforeEach(() => {
    accounts = [];
    console.error = jest.fn();
    (getAlksAccounts as jest.Mock).mockResolvedValue(accounts);
  });

  it('should generate profiles for a single account when account and role are provided', async () => {
    await handleAlksProfilesGenerate({
      account: fakeAccountId,
      role: fakeRole,
      profile: fakeProfile,
    });

    expect(generateProfile).toHaveBeenCalledWith(
      fakeAccountId,
      fakeRole,
      fakeProfile,
      undefined
    );
  });

  it('should generate profiles for a single account when namedProfile is used instead of profile', async () => {
    await handleAlksProfilesGenerate({
      account: fakeAccountId,
      role: fakeRole,
      namedProfile: fakeProfile,
    });

    expect(generateProfile).toHaveBeenCalledWith(
      fakeAccountId,
      fakeRole,
      fakeProfile,
      undefined
    );
  });

  it('should propagate the force flag for generating a single profile when force=true', async () => {
    await handleAlksProfilesGenerate({
      account: fakeAccountId,
      role: fakeRole,
      profile: fakeProfile,
      force: true,
    });

    expect(generateProfile).toHaveBeenCalledWith(
      fakeAccountId,
      fakeRole,
      fakeProfile,
      true
    );
  });

  it('should fail to generate a single profile when role is not provided', async () => {
    await expect(
      handleAlksProfilesGenerate({
        account: fakeAccountId,
        profile: fakeProfile,
      })
    ).rejects.toThrow();

    expect(generateProfile).not.toHaveBeenCalled();
  });

  it('should generate profiles for all accounts when all=true', async () => {
    accounts.push(
      {
        account: fakeAccountId,
        role: fakeRole,
        skypieaAccount: {
          label: 'Fake Label',
          alias: fakeAlias,
          accountOwners: [],
          cloudsploitTrend: [],
          awsAccountId: fakeAccountId,
        },
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      },
      {
        account: fakeAccountId,
        role: 'ReadOnly',
        skypieaAccount: {
          label: 'Fake Label',
          alias: fakeAlias,
          accountOwners: [],
          cloudsploitTrend: [],
          awsAccountId: fakeAccountId,
        },
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      }
    );

    await handleAlksProfilesGenerate({
      all: true,
    });

    expect(generateProfile).toHaveBeenNthCalledWith(
      1,
      fakeAlias,
      fakeRole,
      `${fakeAlias}-${fakeRole}`,
      undefined
    );
    expect(generateProfile).toHaveBeenNthCalledWith(
      2,
      fakeAlias,
      'ReadOnly',
      `${fakeAlias}-ReadOnly`,
      undefined
    );
  });

  it('should throw an error when all=true and getAlksAccounts throws an error', async () => {
    (getAlksAccounts as jest.Mock).mockRejectedValue(new Error('Fake Error'));

    await expect(
      handleAlksProfilesGenerate({
        all: true,
      })
    ).rejects.toThrow();

    expect(generateProfile).not.toHaveBeenCalled();
  });

  it('should log an error when all=true and generateProfile throws an error', async () => {
    accounts.push(
      {
        account: fakeAccountId,
        role: fakeRole,
        skypieaAccount: {
          label: 'Fake Label',
          alias: fakeAlias,
          accountOwners: [],
          cloudsploitTrend: [],
          awsAccountId: fakeAccountId,
        },
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      },
      {
        account: fakeAccountId,
        role: 'ReadOnly',
        skypieaAccount: {
          label: 'Fake Label',
          alias: fakeAlias,
          accountOwners: [],
          cloudsploitTrend: [],
          awsAccountId: fakeAccountId,
        },
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      }
    );

    (generateProfile as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Fake Error');
    });

    await handleAlksProfilesGenerate({
      all: true,
    });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Fake Error')
    );
  });

  it('should log the number of profiles generated when all=true', async () => {
    accounts.push(
      {
        account: fakeAccountId,
        role: fakeRole,
        skypieaAccount: {
          label: 'Fake Label',
          alias: fakeAlias,
          accountOwners: [],
          cloudsploitTrend: [],
          awsAccountId: fakeAccountId,
        },
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      },
      {
        account: fakeAccountId,
        role: 'ReadOnly',
        skypieaAccount: {
          label: 'Fake Label',
          alias: fakeAlias,
          accountOwners: [],
          cloudsploitTrend: [],
          awsAccountId: fakeAccountId,
        },
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      }
    );

    await handleAlksProfilesGenerate({
      all: true,
    });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('2 profiles generated')
    );
  });

  it('should generate profiles for all accounts even when skypiea data is missing', async () => {
    accounts.push(
      {
        account: fakeAccountId,
        role: fakeRole,
        skypieaAccount: {
          label: 'Fake Label',
          alias: fakeAlias,
          accountOwners: [],
          cloudsploitTrend: [],
          awsAccountId: fakeAccountId,
        },
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      },
      {
        account: `${fakeAccountId}/ALKSReadOnly - ${fakeAlias}`,
        role: 'ReadOnly',
        skypieaAccount: null,
        securityLevel: '1',
        iamKeyActive: false,
        maxKeyDuration: 1,
      }
    );

    await handleAlksProfilesGenerate({
      all: true,
    });

    expect(generateProfile).toHaveBeenNthCalledWith(
      1,
      fakeAlias,
      fakeRole,
      `${fakeAlias}-${fakeRole}`,
      undefined
    );
    expect(generateProfile).toHaveBeenNthCalledWith(
      2,
      fakeAccountId,
      'ReadOnly',
      `${fakeAccountId}-ReadOnly`,
      undefined
    );
  });

  it('should throw an error when neither all nor account are provided', async () => {
    await expect(
      handleAlksProfilesGenerate({
        profile: fakeProfile,
      })
    ).rejects.toThrow();

    expect(generateProfile).not.toHaveBeenCalled();
  });
});
