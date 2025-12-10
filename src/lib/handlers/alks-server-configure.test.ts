import commander from 'commander';
import { handleAlksServerConfigure } from './alks-server-configure';
import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { saveMetadata } from '../saveMetadata';
import { checkForUpdate } from '../checkForUpdate';
import { tryToExtractRole } from '../tryToExtractRole';
import { Key } from '../../model/keys';

jest.mock('../errorAndExit');
jest.mock('../getIamKey');
jest.mock('../saveMetadata');
jest.mock('../checkForUpdate');
jest.mock('../tryToExtractRole');
jest.mock('../log');

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('handleAlksServerConfigure', () => {
  const defaultKey: Key = {
    alksAccount: '012345678910/ALKSAdmin - awstest',
    alksRole: 'Admin',
    isIAM: true,
    expires: new Date(),
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    sessionToken: 'token123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getIamKey as jest.Mock).mockResolvedValue(defaultKey);
    (saveMetadata as jest.Mock).mockResolvedValue(undefined);
    (checkForUpdate as jest.Mock).mockResolvedValue(undefined);
    (tryToExtractRole as jest.Mock).mockReturnValue(undefined);
  });

  describe('when account and role are provided', () => {
    it('should get IAM key with provided account and role', async () => {
      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      };

      await handleAlksServerConfigure(options);

      expect(getIamKey).toHaveBeenCalledWith(
        '012345678910/ALKSAdmin - awstest',
        'Admin',
        undefined,
        false,
        false
      );
    });
  });

  describe('when only account is provided', () => {
    it('should try to extract role from account string', async () => {
      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
      };
      (tryToExtractRole as jest.Mock).mockReturnValue('Admin');

      await handleAlksServerConfigure(options);

      expect(tryToExtractRole).toHaveBeenCalledWith(
        '012345678910/ALKSAdmin - awstest'
      );
      expect(getIamKey).toHaveBeenCalledWith(
        '012345678910/ALKSAdmin - awstest',
        'Admin',
        undefined,
        false,
        false
      );
    });
  });

  describe('when iam flag is set', () => {
    it('should pass true for iamOnly parameter', async () => {
      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
      };

      await handleAlksServerConfigure(options);

      expect(getIamKey).toHaveBeenCalledWith(
        '012345678910/ALKSAdmin - awstest',
        'Admin',
        undefined,
        false,
        true
      );
    });
  });

  describe('when favorites flag is set', () => {
    it('should pass true for filterFavorites parameter', async () => {
      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        favorites: true,
      };

      await handleAlksServerConfigure(options);

      expect(getIamKey).toHaveBeenCalledWith(
        '012345678910/ALKSAdmin - awstest',
        'Admin',
        undefined,
        true,
        false
      );
    });
  });

  describe('when getIamKey succeeds', () => {
    it('should save metadata with correct values', async () => {
      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      };

      await handleAlksServerConfigure(options);

      expect(saveMetadata).toHaveBeenCalledWith({
        alksAccount: defaultKey.alksAccount,
        alksRole: defaultKey.alksRole,
        isIam: defaultKey.isIAM,
      });
    });

    it('should check for updates', async () => {
      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      };

      await handleAlksServerConfigure(options);

      expect(checkForUpdate).toHaveBeenCalled();
    });

    it('should display success message', async () => {
      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      };

      await handleAlksServerConfigure(options);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Metadata has been saved')
      );
    });
  });

  describe('when getIamKey fails', () => {
    it('should call errorAndExit', async () => {
      const error = new Error('Failed to get IAM key');
      (getIamKey as jest.Mock).mockRejectedValue(error);

      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      };

      await handleAlksServerConfigure(options);

      expect(errorAndExit).toHaveBeenCalledWith(error);
    });
  });

  describe('when saveMetadata fails', () => {
    it('should call errorAndExit with appropriate message', async () => {
      const error = new Error('Failed to save');
      (saveMetadata as jest.Mock).mockRejectedValue(error);

      const options: commander.OptionValues = {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      };

      await handleAlksServerConfigure(options);

      expect(errorAndExit).toHaveBeenCalledWith(
        'Unable to save metadata!',
        error
      );
    });
  });
});
