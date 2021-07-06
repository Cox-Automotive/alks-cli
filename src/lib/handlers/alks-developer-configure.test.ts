import { errorAndExit } from '../errorAndExit';
import { handleAlksDeveloperConfigure } from './alks-developer-configure';
import commander from 'commander';
import { promptForServer } from '../promptForServer';
import { promptForUserId } from '../promptForUserId';
import { promptForPassword } from '../promptForPassword';
import { confirm } from '../confirm';
import { savePassword } from '../savePassword';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { promptForOutputFormat } from '../promptForOutputFormat';
import { checkForUpdate } from '../checkForUpdate';
import { trackActivity } from '../trackActivity';
import { setServer } from '../state/server';
import { setUserId } from '../state/userId';
import { setAlksAccount } from '../state/alksAccount';
import { setAlksRole } from '../state/alksRole';
import { setOutputFormat } from '../state/outputFormat';
import { promptForAuthType } from '../promptForAuthType';
import { install } from 'tabtab';

jest.mock('../state/server');
jest.mock('../state/userId');
jest.mock('../state/alksAccount');
jest.mock('../state/alksRole');
jest.mock('../state/outputFormat');
jest.mock('../errorAndExit');
jest.mock('../promptForServer');
jest.mock('../promptForUserId');
jest.mock('../promptForPassword');
jest.mock('../confirm');
jest.mock('../savePassword');
jest.mock('../promptForAlksAccountAndRole');
jest.mock('../promptForOutputFormat');
jest.mock('../checkForUpdate');
jest.mock('../trackActivity');
jest.mock('../promptForAuthType');
jest.mock('tabtab');

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('handleAlksDeveloperConfigure', () => {
  interface TestCase {
    description: string;
    options: commander.OptionValues;
    program: commander.Command;
    shouldErr: boolean;
    promptForServerFails: boolean;
    server: string;
    shouldSaveServer: boolean;
    promptForUserIdFails: boolean;
    userId: string;
    shouldSaveUserId: boolean;
    authType: 'OAuth2 Refresh Token' | 'Username/Password (not recommended)';
    promptForPasswordFails: boolean;
    password: string;
    confirmSavePasswordFails: boolean;
    savePassword: boolean;
    shouldSavePassword: boolean;
    savePasswordFails: boolean;
    promptForAlksAccountAndRoleFails: boolean;
    alksAccount: string;
    alksRole: string;
    shouldSaveAlksAccount: boolean;
    shouldSaveAlksRole: boolean;
    promptForOutputFormatFails: boolean;
    outputFormat: string;
    shouldSaveOutputFormat: boolean;
    tabtabInstallFails: boolean;
    checkForUpdateFails: boolean;
    trackActivityFails: boolean;
  }
  const defaultTestCase: Omit<TestCase, 'description'> = {
    options: {} as commander.OptionValues,
    program: {} as commander.Command,
    shouldErr: false,
    promptForServerFails: false,
    server: '',
    shouldSaveServer: false,
    promptForUserIdFails: false,
    userId: '',
    shouldSaveUserId: false,
    authType: 'Username/Password (not recommended)',
    promptForPasswordFails: false,
    password: '',
    confirmSavePasswordFails: false,
    savePassword: false,
    savePasswordFails: false,
    shouldSavePassword: false,
    promptForAlksAccountAndRoleFails: false,
    alksAccount: '',
    alksRole: '',
    shouldSaveAlksAccount: false,
    shouldSaveAlksRole: false,
    promptForOutputFormatFails: false,
    outputFormat: '',
    shouldSaveOutputFormat: false,
    tabtabInstallFails: false,
    checkForUpdateFails: false,
    trackActivityFails: false,
  };

  const testCases: TestCase[] = [
    {
      ...defaultTestCase,
      description: 'when prompting for the server url fails',
      shouldErr: true,
      promptForServerFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when prompting for a username fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      promptForUserIdFails: true,
      shouldSaveServer: true,
    },
    {
      ...defaultTestCase,
      description: 'when prompting for the password fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      promptForPasswordFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
    },
    {
      ...defaultTestCase,
      description: 'when prompting for the token fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      authType: 'OAuth2 Refresh Token',
      promptForPasswordFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
    },
    {
      ...defaultTestCase,
      description: 'when confirming if the user wants to save password fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      confirmSavePasswordFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
    },
    {
      ...defaultTestCase,
      description: 'when saving the password fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      savePassword: true,
      savePasswordFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSavePassword: true,
    },
    {
      ...defaultTestCase,
      description: 'when getting the alks account fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      savePassword: true,
      promptForAlksAccountAndRoleFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSavePassword: true,
    },
    {
      ...defaultTestCase,
      description: 'when prompting for the output format fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      savePassword: true,
      alksAccount: '012345678910/ALKSAdmin - awstest',
      alksRole: 'Admin',
      promptForOutputFormatFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSavePassword: true,
      shouldSaveAlksAccount: true,
      shouldSaveAlksRole: true,
    },
    {
      ...defaultTestCase,
      description: 'when installing tab completion fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      savePassword: true,
      alksAccount: '012345678910/ALKSAdmin - awstest',
      alksRole: 'Admin',
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSavePassword: true,
      shouldSaveAlksAccount: true,
      shouldSaveAlksRole: true,
      shouldSaveOutputFormat: true,
      tabtabInstallFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when checkForUpdate fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      savePassword: true,
      alksAccount: '012345678910/ALKSAdmin - awstest',
      alksRole: 'Admin',
      outputFormat: 'env',
      checkForUpdateFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSavePassword: true,
      shouldSaveAlksAccount: true,
      shouldSaveAlksRole: true,
      shouldSaveOutputFormat: true,
    },
    {
      ...defaultTestCase,
      description: 'when tracking activity fails',
      shouldErr: true,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      savePassword: true,
      alksAccount: '012345678910/ALKSAdmin - awstest',
      alksRole: 'Admin',
      outputFormat: 'env',
      trackActivityFails: true,
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSavePassword: true,
      shouldSaveAlksAccount: true,
      shouldSaveAlksRole: true,
      shouldSaveOutputFormat: true,
    },
    {
      ...defaultTestCase,
      description: 'when everything succeeds',
      shouldErr: false,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      savePassword: true,
      alksAccount: '012345678910/ALKSAdmin - awstest',
      alksRole: 'Admin',
      outputFormat: 'env',
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSavePassword: true,
      shouldSaveAlksAccount: true,
      shouldSaveAlksRole: true,
      shouldSaveOutputFormat: true,
    },
    {
      ...defaultTestCase,
      description:
        'when everything succeeds but the user declines saving password',
      shouldErr: false,
      server: 'https://alks.com/rest',
      userId: 'bobby',
      password: 'letmein',
      alksAccount: '012345678910/ALKSAdmin - awstest',
      alksRole: 'Admin',
      outputFormat: 'env',
      shouldSaveServer: true,
      shouldSaveUserId: true,
      shouldSaveAlksAccount: true,
      shouldSaveAlksRole: true,
      shouldSaveOutputFormat: true,
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
        (promptForAuthType as jest.Mock).mockImplementation(
          async () => t.authType
        );
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
        (promptForAlksAccountAndRole as jest.Mock).mockImplementation(
          async () => {
            if (t.promptForAlksAccountAndRoleFails) {
              throw new Error();
            } else {
              return { alksAccount: t.alksAccount, alksRole: t.alksRole };
            }
          }
        );
        (promptForOutputFormat as jest.Mock).mockImplementation(async () => {
          if (t.promptForOutputFormatFails) {
            throw new Error();
          } else {
            return t.outputFormat;
          }
        });
        (install as jest.Mock).mockImplementation(async () => {
          if (t.tabtabInstallFails) {
            throw new Error();
          }
        });
        (checkForUpdate as jest.Mock).mockImplementation(async () => {
          if (t.checkForUpdateFails) {
            throw new Error();
          }
        });
        (trackActivity as jest.Mock).mockImplementation(async () => {
          if (t.trackActivityFails) {
            throw new Error();
          }
        });

        ((errorAndExit as unknown) as jest.Mock).mockImplementation(() => {
          errorThrown = true;
        });

        await handleAlksDeveloperConfigure(t.options);
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

      if (t.shouldSaveServer) {
        it('attempts to save the server url', () => {
          expect(setServer).toBeCalledWith(t.server);
        });
      }

      if (t.shouldSaveUserId) {
        it('attempts to save the userid', () => {
          expect(setUserId).toBeCalledWith(t.userId);
        });
      }

      if (t.shouldSavePassword) {
        it('attempts to save password', () => {
          expect(savePassword).toBeCalledWith(t.password);
        });
      }

      if (t.shouldSaveAlksAccount) {
        it('attempts to save the alks account', () => {
          expect(setAlksAccount).toBeCalledWith(t.alksAccount);
        });
      }

      if (t.shouldSaveAlksRole) {
        it('attempts to save the alks role', () => {
          expect(setAlksRole).toBeCalledWith(t.alksRole);
        });
      }

      if (t.shouldSaveOutputFormat) {
        it('attempts to save the output format', () => {
          expect(setOutputFormat).toBeCalledWith(t.outputFormat);
        });
      }
    });
  }
});
