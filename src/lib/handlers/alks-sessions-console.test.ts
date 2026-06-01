import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { handleAlksSessionsConsole } from './alks-sessions-console';
import { Key } from '../../model/keys';

jest.mock('../errorAndExit');
jest.mock('../getIamKey');
jest.mock('../checkForUpdate');
jest.mock('../log');
jest.mock('../getUserAgentString', () => ({
  getUserAgentString: () => 'test-ua',
}));
jest.mock('../state/alksAccount');
jest.mock('../state/alksRole');
jest.mock('open', () => ({ default: jest.fn().mockResolvedValue(undefined) }));
jest.mock('axios');

// Silence console output
jest.spyOn(global.console, 'error').mockImplementation(() => {});
jest.spyOn(global.console, 'log').mockImplementation(() => {});

const mockKey: Key = {
  accessKey: 'AKIA_FAKE',
  secretKey: 'secret',
  sessionToken: 'token',
  expires: new Date(),
  alksAccount: '254681725729',
  alksRole: 'Admin',
  isIAM: true,
};

const fakeErrorSymbol = Symbol('errorAndExit');

describe('handleAlksSessionsConsole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (errorAndExit as unknown as jest.Mock).mockImplementation(() => {
      throw fakeErrorSymbol;
    });
    (getIamKey as jest.Mock).mockResolvedValue(mockKey);

    // Mock axios for the AWS federation call inside generateConsoleUrl
    const axios = require('axios');
    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: { SigninToken: 'fake-signin-token' },
    });
  });

  describe('changeRequestOptions passthrough', () => {
    it('passes ciid/activityType/description to getIamKey when all three are provided', async () => {
      await handleAlksSessionsConsole({
        account: '254681725729/ALKSAdmin - awscacclogi',
        role: 'Admin',
        ciid: 'CI2410930',
        activityType: 'Operational Task',
        description: 'reviewing secret values',
        url: true, // avoid browser open
      });

      expect(getIamKey).toHaveBeenCalledWith(
        '254681725729/ALKSAdmin - awscacclogi',
        'Admin',
        undefined,
        false,
        false,
        undefined,
        {
          ciid: 'CI2410930',
          activityType: 'Operational Task',
          description: 'reviewing secret values',
        }
      );
    });

    it('passes changeNumber to getIamKey when --chg-number is provided', async () => {
      await handleAlksSessionsConsole({
        account: '254681725729/ALKSAdmin - awscacclogi',
        role: 'Admin',
        chgNumber: 'CHG1234567',
        url: true,
      });

      expect(getIamKey).toHaveBeenCalledWith(
        '254681725729/ALKSAdmin - awscacclogi',
        'Admin',
        undefined,
        false,
        false,
        undefined,
        { changeNumber: 'CHG1234567' }
      );
    });

    it('passes empty changeRequestOptions when no change ticket flags are provided', async () => {
      await handleAlksSessionsConsole({
        account: '254681725729/ALKSAdmin - awscacclogi',
        role: 'Admin',
        url: true,
      });

      expect(getIamKey).toHaveBeenCalledWith(
        '254681725729/ALKSAdmin - awscacclogi',
        'Admin',
        undefined,
        false,
        false,
        undefined,
        { ciid: undefined, activityType: undefined, description: undefined }
      );
    });
  });

  describe('flag validation', () => {
    it('calls errorAndExit when only --ciid is provided without --activity-type and --description', async () => {
      try {
        await handleAlksSessionsConsole({
          account: '254681725729/ALKSAdmin - awscacclogi',
          role: 'Admin',
          ciid: 'CI2410930',
        });
      } catch (e) {
        expect(e).toBe(fakeErrorSymbol);
      }
      expect(errorAndExit).toHaveBeenCalled();
      expect(getIamKey).not.toHaveBeenCalled();
    });

    it('calls errorAndExit when --chg-number and --ciid are both provided', async () => {
      try {
        await handleAlksSessionsConsole({
          account: '254681725729/ALKSAdmin - awscacclogi',
          role: 'Admin',
          chgNumber: 'CHG1234567',
          ciid: 'CI2410930',
          activityType: 'Operational Task',
          description: 'reviewing secret values',
        });
      } catch (e) {
        expect(e).toBe(fakeErrorSymbol);
      }
      expect(errorAndExit).toHaveBeenCalled();
      expect(getIamKey).not.toHaveBeenCalled();
    });
  });
});
