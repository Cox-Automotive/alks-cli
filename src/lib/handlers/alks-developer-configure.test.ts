import { errorAndExit } from '../errorAndExit';
import { handleAlksDeveloperConfigure } from './alks-developer-configure';
import commander from 'commander';
import { promptForServer } from '../promptForServer';
import { promptForUserId } from '../promptForUserId';
import { promptForPassword } from '../promptForPassword';
import { confirm } from '../confirm';
import { savePassword } from '../savePassword';
import { getAlksAccount } from '../getAlksAccount';
import { promptForOutputFormat } from '../promptForOutputFormat';
import { saveDeveloper } from '../saveDeveloper';
import { checkForUpdate } from '../checkForUpdate';
import { trackActivity } from '../trackActivity';

jest.mock('../errorAndExit', () => ({
  __esModule: true,
  errorAndExit: jest.fn(),
}));

jest.mock('../promptForServer', () => ({
  __esModule: true,
  promptForServer: jest.fn(),
}));

jest.mock('../promptForUserId', () => ({
  __esModule: true,
  promptForUserId: jest.fn(),
}));

jest.mock('../promptForPassword', () => ({
  __esModule: true,
  promptForPassword: jest.fn(),
}));

jest.mock('../confirm', () => ({
  __esModule: true,
  confirm: jest.fn(),
}));

jest.mock('../savePassword', () => ({
  __esModule: true,
  savePassword: jest.fn(),
}));

jest.mock('../getAlksAccount', () => ({
  __esModule: true,
  getAlksAccount: jest.fn(),
}));

jest.mock('../promptForOutputFormat', () => ({
  __esModule: true,
  promptForOutputFormat: jest.fn(),
}));

jest.mock('../saveDeveloper', () => ({
  __esModule: true,
  saveDeveloper: jest.fn(),
}));

jest.mock('../checkForUpdate', () => ({
  __esModule: true,
  checkForUpdate: jest.fn(),
}));

jest.mock('../trackActivity', () => ({
  __esModule: true,
  trackActivity: jest.fn(),
}));

describe('handleAlksDeveloperConfigure', () => {
  interface TestCase {
    description: string;
    options: commander.OptionValues;
    program: commander.Command;
    shouldErr: boolean;
    promptForServerFails: boolean;
    server: string;
    promptForUserIdFails: boolean;
    userId: string;
    promptForPasswordFails: boolean;
    password: string;
    confirmSavePasswordFails: boolean;
    savePassword: boolean;
    savePasswordFails: boolean;
    getAlksAccountFails: boolean;
    alksAccount: string;
    alksRole: string;
    promptForOutputFormatFails: boolean;
    outputFormat: string;
    saveDeveloperFails: boolean;
    checkForUpdateFails: boolean;
    tractActivityFails: boolean;
  }
  const defaultTestCase: Omit<TestCase, 'description'> = {
    options: {} as commander.OptionValues,
    program: {} as commander.Command,
    shouldErr: false,
    promptForServerFails: false,
    server: '',
    promptForUserIdFails: false,
    userId: '',
    promptForPasswordFails: false,
    password: '',
    confirmSavePasswordFails: false,
    savePassword: false,
    savePasswordFails: false,
    getAlksAccountFails: false,
    alksAccount: '',
    alksRole: '',
    promptForOutputFormatFails: false,
    outputFormat: '',
    saveDeveloperFails: false,
    checkForUpdateFails: false,
    tractActivityFails: false,
  };

  const testCases: TestCase[] = [
    {
      ...defaultTestCase,
      description: 'when prompting for the server url fails',
      shouldErr: true,
      promptForServerFails: true,
    },
  ];

  for (const t of testCases) {
    describe(t.description, () => {
      let errorThrown = false;

      beforeEach(async () => {
        (promptForServer as jest.Mock).mockImplementation(async () => {
          if (t.promptForServerFails) {
            throw new Error();
          } else {
            return t.server;
          }
        });
        (promptForUserId as jest.Mock).mockImplementation(async () => {
          if (t.promptForUserIdFails) {
            throw new Error();
          } else {
            return t.userId;
          }
        });
        (promptForPassword as jest.Mock).mockImplementation(async () => {
          if (t.promptForPasswordFails) {
            throw new Error();
          } else {
            return t.password;
          }
        });
        (confirm as jest.Mock).mockImplementation(async () => {
          if (t.confirmSavePasswordFails) {
            throw new Error();
          } else {
            return t.savePassword;
          }
        });
        (savePassword as jest.Mock).mockImplementation(async () => {
          if (t.savePasswordFails) {
            throw new Error();
          }
        });
        (getAlksAccount as jest.Mock).mockImplementation(async () => {
          if (t.getAlksAccountFails) {
            throw new Error();
          } else {
            return { alksAccount: t.alksAccount, alksRole: t.alksRole };
          }
        });
        (promptForOutputFormat as jest.Mock).mockImplementation(async () => {
          if (t.promptForOutputFormatFails) {
            throw new Error();
          } else {
            return t.outputFormat;
          }
        });
        (saveDeveloper as jest.Mock).mockImplementation(async () => {
          if (t.saveDeveloperFails) {
            throw new Error();
          }
        });
        (checkForUpdate as jest.Mock).mockImplementation(async () => {
          if (t.checkForUpdateFails) {
            throw new Error();
          }
        });
        (trackActivity as jest.Mock).mockImplementation(async () => {
          if (t.tractActivityFails) {
            throw new Error();
          }
        });

        (errorAndExit as jest.Mock).mockImplementation(() => {
          errorThrown = true;
        });

        await handleAlksDeveloperConfigure(
          {} as commander.OptionValues,
          {} as commander.Command
        );
      });

      if (t.shouldErr) {
        it('calls errorAndExit', () => {
          expect(errorThrown).toBe(true);
        });
      } else {
        it(`doesn't call errorAndExit`, () => {
          expect(errorThrown).toBe(false);
        });
      }
    });
  }
});
