import { Key } from '../model/keys';
import { getKeyOutput } from './getKeyOutput';
import { updateCreds } from './updateCreds';

jest.mock('./updateCreds');
jest.mock('./log');
jest.mock('./getStdErrPrompt');
jest.mock('./getPrompt');
jest.mock('inquirer-autocomplete-prompt', () => ({}), { virtual: true });

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('getKeyOutput', () => {
  const mockKey: Key = {
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    sessionToken: 'AQoDYXdzEJr...<snip>...EXAMPLE',
    alksAccount: '012345678910/ALKSAdmin - awstest123',
    alksRole: 'Admin',
    isIAM: false,
    expires: new Date('2026-03-24T00:00:00Z'),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('creds format', () => {
    it('should pass key with changeNumber to updateCreds when changeNumber is defined (AC-1.1)', () => {
      const keyWithChangeNumber: Key = {
        ...mockKey,
        changeNumber: 'CHG123456',
      };
      const mockUpdateCreds = updateCreds as jest.MockedFunction<
        typeof updateCreds
      >;
      mockUpdateCreds.mockReturnValue(true);

      getKeyOutput('creds', keyWithChangeNumber, undefined, false);

      // Verify updateCreds was called with the key containing changeNumber
      expect(mockUpdateCreds).toHaveBeenCalledWith(
        expect.objectContaining({
          changeNumber: 'CHG123456',
        }),
        undefined,
        false
      );
    });

    it('should pass key without changeNumber to updateCreds when changeNumber is undefined (AC-1.2)', () => {
      const keyWithoutChangeNumber: Key = {
        ...mockKey,
        // changeNumber is undefined
      };
      const mockUpdateCreds = updateCreds as jest.MockedFunction<
        typeof updateCreds
      >;
      mockUpdateCreds.mockReturnValue(true);

      getKeyOutput('creds', keyWithoutChangeNumber, undefined, false);

      // Verify updateCreds was called with the key (changeNumber will be undefined)
      expect(mockUpdateCreds).toHaveBeenCalledWith(
        expect.objectContaining({
          accessKey: keyWithoutChangeNumber.accessKey,
        }),
        undefined,
        false
      );

      // Verify changeNumber is not set (undefined)
      const callArg = mockUpdateCreds.mock.calls[0][0] as Key;
      expect(callArg.changeNumber).toBeUndefined();
    });

    it('should return success message when updateCreds succeeds', () => {
      const mockUpdateCreds = updateCreds as jest.MockedFunction<
        typeof updateCreds
      >;
      mockUpdateCreds.mockReturnValue(true);

      const result = getKeyOutput('creds', mockKey, undefined, false);

      expect(result).toBe('Your AWS credentials file has been updated');
    });

    it('should return success message with profile name when profile is specified', () => {
      const mockUpdateCreds = updateCreds as jest.MockedFunction<
        typeof updateCreds
      >;
      mockUpdateCreds.mockReturnValue(true);

      const result = getKeyOutput('creds', mockKey, 'myprofile', false);

      expect(result).toBe(
        'Your AWS credentials file has been updated with the named profile: myprofile'
      );
    });
  });

  describe('docker format', () => {
    it('should include changeNumber when defined (AC-2.1)', () => {
      const keyWithChangeNumber: Key = {
        ...mockKey,
        changeNumber: 'CHG123456',
      };

      const result = getKeyOutput(
        'docker',
        keyWithChangeNumber,
        undefined,
        false
      );

      expect(result).toContain('-e ALKS_CHANGE_NUMBER=CHG123456');
    });

    it('should not include changeNumber when undefined (AC-2.2)', () => {
      const result = getKeyOutput('docker', mockKey, undefined, false);

      expect(result).not.toContain('ALKS_CHANGE_NUMBER');
    });
  });

  describe('terraformarg format', () => {
    it('should include changeNumber when defined (AC-3.1)', () => {
      const keyWithChangeNumber: Key = {
        ...mockKey,
        changeNumber: 'CHG123456',
      };

      const result = getKeyOutput(
        'terraformarg',
        keyWithChangeNumber,
        undefined,
        false
      );

      expect(result).toContain('-var alks_change_number=CHG123456');
    });

    it('should not include changeNumber when undefined (AC-3.2)', () => {
      const result = getKeyOutput('terraformarg', mockKey, undefined, false);

      expect(result).not.toContain('alks_change_number');
    });
  });

  describe('other formats', () => {
    it('should include changeNumber in json format', () => {
      const keyWithChangeNumber: Key = {
        ...mockKey,
        changeNumber: 'CHG123456',
      };

      const result = getKeyOutput(
        'json',
        keyWithChangeNumber,
        undefined,
        false
      );
      const parsed = JSON.parse(result);

      expect(parsed.changeNumber).toBe('CHG123456');
    });

    it('should handle undefined changeNumber in json format', () => {
      const result = getKeyOutput('json', mockKey, undefined, false);
      const parsed = JSON.parse(result);

      expect(parsed.changeNumber).toBeUndefined();
    });
  });
});
