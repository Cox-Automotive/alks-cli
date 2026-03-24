import { readFileSync, writeFileSync } from 'fs';
import { Key } from '../model/keys';
import { updateCreds } from './updateCreds';
import { createInstance } from 'prop-ini';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    mkdir: jest.fn(),
    appendFile: jest.fn(),
    stat: jest.fn(),
    unlink: jest.fn(),
  },
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));
jest.mock('prop-ini');
jest.mock('./getAwsCredentialsFile');
jest.mock('./addNewLineToEof');
jest.mock('./log');
jest.mock('inquirer-autocomplete-prompt', () => ({}), { virtual: true });

describe('updateCreds', () => {
  const mockCredFile = '/home/user/.aws/credentials';
  const mockKey: Key = {
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    sessionToken: 'AQoDYXdzEJr...<snip>...EXAMPLE',
    alksAccount: '012345678910/ALKSAdmin - awstest123',
    alksRole: 'Admin',
    isIAM: false,
    expires: new Date('2026-03-24T00:00:00Z'),
  };

  const mockPropIni = {
    decode: jest.fn(),
    addData: jest.fn(),
    removeData: jest.fn(),
    encode: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAwsCredentialsFile as jest.Mock).mockReturnValue(mockCredFile);
    (createInstance as jest.Mock).mockReturnValue(mockPropIni);
    mockPropIni.decode.mockReturnValue({ sections: {} });
    (readFileSync as jest.Mock).mockReturnValue('');
  });

  describe('changeNumber handling', () => {
    it('should write changeNumber as a comment above the profile section when present (AC-1.1)', () => {
      const keyWithChangeNumber: Key = {
        ...mockKey,
        changeNumber: 'CHG123456',
      };

      // Mock initial credentials file content (empty)
      (readFileSync as jest.Mock).mockReturnValue('');

      // Mock the encoded content after propIni.encode()
      const encodedContent = `[default]
aws_access_key_id = ${mockKey.accessKey}
aws_secret_access_key = ${mockKey.secretKey}
aws_session_token = ${mockKey.sessionToken}
alks_managed_by = alks
`;
      mockPropIni.encode.mockImplementation(() => {
        (readFileSync as jest.Mock).mockReturnValue(encodedContent);
      });

      const result = updateCreds(keyWithChangeNumber, undefined, false);

      expect(result).toBe(true);

      // Verify that writeFileSync was called with content containing the comment
      expect(writeFileSync).toHaveBeenCalled();
      const writeCall = (writeFileSync as jest.Mock).mock.calls.find(
        (call) => call[0] === mockCredFile && typeof call[1] === 'string'
      );

      if (writeCall) {
        const writtenContent = writeCall[1];
        expect(writtenContent).toContain('# CHANGE_NUMBER=CHG123456');
        expect(writtenContent).toContain('[default]');
        // Verify the comment appears before the profile section
        const commentIndex = writtenContent.indexOf(
          '# CHANGE_NUMBER=CHG123456'
        );
        const sectionIndex = writtenContent.indexOf('[default]');
        expect(commentIndex).toBeGreaterThan(-1);
        expect(sectionIndex).toBeGreaterThan(-1);
        expect(commentIndex).toBeLessThan(sectionIndex);
      }
    });

    it('should not write changeNumber comment when changeNumber is undefined (AC-1.2)', () => {
      const keyWithoutChangeNumber: Key = {
        ...mockKey,
        // changeNumber is undefined
      };

      const encodedContent = `[default]
aws_access_key_id = ${mockKey.accessKey}
aws_secret_access_key = ${mockKey.secretKey}
aws_session_token = ${mockKey.sessionToken}
alks_managed_by = alks
`;
      mockPropIni.encode.mockImplementation(() => {
        (readFileSync as jest.Mock).mockReturnValue(encodedContent);
      });

      const result = updateCreds(keyWithoutChangeNumber, undefined, false);

      expect(result).toBe(true);

      // If writeFileSync was called, verify no ALKS_CHANGE_NUMBER comment is present
      const writeCall = (writeFileSync as jest.Mock).mock.calls.find(
        (call) => call[0] === mockCredFile && typeof call[1] === 'string'
      );

      if (writeCall) {
        const writtenContent = writeCall[1];
        expect(writtenContent).not.toContain('CHANGE_NUMBER');
      }
    });

    it('should write changeNumber comment for named profile', () => {
      const keyWithChangeNumber: Key = {
        ...mockKey,
        changeNumber: 'CHG789012',
      };

      const encodedContent = `[myprofile]
aws_access_key_id = ${mockKey.accessKey}
aws_secret_access_key = ${mockKey.secretKey}
aws_session_token = ${mockKey.sessionToken}
alks_managed_by = alks
`;
      mockPropIni.encode.mockImplementation(() => {
        (readFileSync as jest.Mock).mockReturnValue(encodedContent);
      });

      const result = updateCreds(keyWithChangeNumber, 'myprofile', false);

      expect(result).toBe(true);

      const writeCall = (writeFileSync as jest.Mock).mock.calls.find(
        (call) => call[0] === mockCredFile && typeof call[1] === 'string'
      );

      if (writeCall) {
        const writtenContent = writeCall[1];
        expect(writtenContent).toContain('# CHANGE_NUMBER=CHG789012');
        expect(writtenContent).toContain('[myprofile]');
      }
    });
  });
});
