import { handleAlksCr } from './alks-cr';
import * as getAlksModule from '../getAlks';
import * as getAuthModule from '../getAuth';
import * as getAwsAccountFromStringModule from '../getAwsAccountFromString';
import * as promptForAlksAccountAndRoleModule from '../promptForAlksAccountAndRole';

describe('handleAlksCr', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const mockErrorAndExit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(require('../errorAndExit'), 'errorAndExit')
      .mockImplementation(mockErrorAndExit);
  });

  it('should error if no CR number is provided', async () => {
    await handleAlksCr({});
    expect(mockErrorAndExit).toHaveBeenCalledWith(
      'Please provide a Change Request number using --cr <crNumber>'
    );
  });

  it('should prompt for account/role if not provided and call alks.getIAMKeys', async () => {
    const fakeAuth = { token: 't' };
    const fakeAlks = {
      getIAMKeys: jest.fn().mockResolvedValue({ key: 'val' }),
    };
    const fakeAwsAccount = { id: '123' };
    jest.spyOn(getAuthModule, 'getAuth').mockResolvedValue(fakeAuth);
    jest.spyOn(getAlksModule, 'getAlks').mockResolvedValue(fakeAlks as any);
    jest
      .spyOn(getAwsAccountFromStringModule, 'getAwsAccountFromString')
      .mockResolvedValue(fakeAwsAccount as any);
    jest
      .spyOn(promptForAlksAccountAndRoleModule, 'promptForAlksAccountAndRole')
      .mockResolvedValue({ alksAccount: 'acc', alksRole: 'role' });

    await handleAlksCr({ cr: 'CR123' });
    expect(fakeAlks.getIAMKeys).toHaveBeenCalledWith({
      account: '123',
      role: 'role',
      sessionTime: 1,
      changeRequestNumber: 'CR123',
    });
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('CR operation result:')
    );
  });

  it('should use provided account/role and sessionTime', async () => {
    const fakeAuth = { token: 't' };
    const fakeAlks = {
      getIAMKeys: jest.fn().mockResolvedValue({ key: 'val' }),
    };
    const fakeAwsAccount = { id: '123' };
    jest.spyOn(getAuthModule, 'getAuth').mockResolvedValue(fakeAuth);
    jest.spyOn(getAlksModule, 'getAlks').mockResolvedValue(fakeAlks as any);
    jest
      .spyOn(getAwsAccountFromStringModule, 'getAwsAccountFromString')
      .mockResolvedValue(fakeAwsAccount as any);

    await handleAlksCr({
      cr: 'CR123',
      account: 'acc',
      role: 'role',
      sessionTime: 2,
    });
    expect(fakeAlks.getIAMKeys).toHaveBeenCalledWith({
      account: '123',
      role: 'role',
      sessionTime: 2,
      changeRequestNumber: 'CR123',
    });
  });

  it('should pass workloadId if provided', async () => {
    const fakeAuth = { token: 't' };
    const fakeAlks = {
      getIAMKeys: jest.fn().mockResolvedValue({ key: 'val' }),
    };
    const fakeAwsAccount = { id: '123' };
    jest.spyOn(getAuthModule, 'getAuth').mockResolvedValue(fakeAuth);
    jest.spyOn(getAlksModule, 'getAlks').mockResolvedValue(fakeAlks as any);
    jest
      .spyOn(getAwsAccountFromStringModule, 'getAwsAccountFromString')
      .mockResolvedValue(fakeAwsAccount as any);

    await handleAlksCr({
      cr: 'CR123',
      account: 'acc',
      role: 'role',
      sessionTime: 2,
      workloadId: 'wl-abc',
    });
    expect(fakeAlks.getIAMKeys).toHaveBeenCalledWith({
      account: '123',
      role: 'role',
      sessionTime: 2,
      changeRequestNumber: 'CR123',
      workloadId: 'wl-abc',
    });
  });
});
