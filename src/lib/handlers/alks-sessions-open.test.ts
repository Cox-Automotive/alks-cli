import { errorAndExit } from '../errorAndExit';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { tryToExtractRole } from '../tryToExtractRole';
import { getKeyOutput } from '../getKeyOutput';
import { getIamKey } from '../getIamKey';
import { handleAlksSessionsOpen } from './alks-sessions-open';
import { Key } from '../../model/keys';
import { getAlksAccount } from '../state/alksAccount';
import { getAlksRole } from '../state/alksRole';
import { getOutputFormat } from '../state/outputFormat';

jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../tryToExtractRole');
jest.mock('../state/alksAccount');
jest.mock('../state/alksRole');
jest.mock('../state/outputFormat');
jest.mock('../getIamKey');
jest.mock('../getKeyOutput');
jest.mock('../log');

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});

// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('handleAlksSessionsOpen', () => {
  interface TestCase {
    description: string;
    options: commander.OptionValues;
    shouldErr: boolean;
    checkForUpdateFails: boolean;
    tryToExtractRoleFails: boolean;
    shouldTryToExtractRole: boolean;
    extractedRole: string;
    getAlksAccountFails: boolean;
    alksAccount: string;
    getAlksRoleFails: boolean;
    alksRole: string;
    getOutputFormatFails: boolean;
    outputFormat: string;
    shouldGetIamKey: boolean;
    getIamKeyFails: boolean;
    getIamKeyParams: {
      alksAccount: string | undefined;
      alksRole: string | undefined;
      newSession: boolean | undefined;
      favorites: boolean | undefined;
      iamOnly: boolean;
      duration: number | undefined;
    };
    key: Key;
    getKeyOutputFails: boolean;
    shouldGetKeyOutput: boolean;
    getKeyOutputParams: {
      format: string;
      profile: string | undefined;
      force: boolean | undefined;
    };
    keyOutput: string;
  }
  const defaultTestCase: Omit<TestCase, 'description'> = {
    options: {} as commander.OptionValues,
    shouldErr: false,
    checkForUpdateFails: false,
    tryToExtractRoleFails: false,
    shouldTryToExtractRole: false,
    extractedRole: '',
    getAlksAccountFails: false,
    alksAccount: '000000000000/ALKSAdmin - awszero',
    getAlksRoleFails: false,
    alksRole: 'Admin',
    getOutputFormatFails: false,
    outputFormat: 'env',
    shouldGetIamKey: false,
    getIamKeyFails: false,
    getIamKeyParams: {
      alksAccount: '',
      alksRole: '',
      newSession: undefined,
      favorites: undefined,
      iamOnly: true,
      duration: undefined,
    },
    key: {} as Key,
    getKeyOutputFails: false,
    shouldGetKeyOutput: false,
    getKeyOutputParams: {
      format: '',
      profile: undefined,
      force: undefined,
    },
    keyOutput: '',
  };

  const testCases: TestCase[] = [
    {
      ...defaultTestCase,
      description: 'when requesting default account and getAlksAccount fails',
      shouldErr: true,
      options: {
        default: true,
      },
      getAlksAccountFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when requesting default account and getAlksRole fails',
      shouldErr: true,
      options: {
        default: true,
      },
      getAlksRoleFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when getting an IAM key fails',
      shouldErr: true,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      getIamKeyFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when getting a session key fails',
      shouldErr: true,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: false,
        duration: undefined,
      },
      getIamKeyFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when getOutputFormat fails',
      shouldErr: true,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      getOutputFormatFails: true,
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
    },
    {
      ...defaultTestCase,
      description: 'when getKeyOutput fails',
      shouldErr: true,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
      getKeyOutputFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when checkForUpdate fails',
      shouldErr: true,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
      checkForUpdateFails: true,
    },
    {
      ...defaultTestCase,
      description: 'when getIamKey succeeds',
      shouldErr: false,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
    },
    {
      ...defaultTestCase,
      description: 'when getSessionKey succeeds',
      shouldErr: false,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: false,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: false,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
    },
    {
      ...defaultTestCase,
      description: 'when everything succeeds and a profile is passed',
      shouldErr: false,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
        namedProfile: 'bobbybob',
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: 'bobbybob',
        force: undefined,
      },
    },
    {
      ...defaultTestCase,
      description: 'when everything succeeds and "force" is passed',
      shouldErr: false,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        role: 'Admin',
        iam: true,
        force: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: true,
      },
    },
    {
      ...defaultTestCase,
      description: 'when no role is passed and tryToExtractRole succeeds',
      shouldErr: false,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        iam: true,
      },
      shouldTryToExtractRole: true,
      extractedRole: 'Admin',
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: 'Admin',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
    },
    {
      ...defaultTestCase,
      description: 'when no role is passed and tryToExtractRole fails',
      shouldErr: false,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        iam: true,
      },
      shouldTryToExtractRole: true,
      tryToExtractRoleFails: true,
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '012345678910/ALKSAdmin - awstest',
        alksRole: undefined,
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '998877665544/ALKSReadOnly - awsother',
        alksRole: 'ReadOnly',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
    },
    {
      ...defaultTestCase,
      description:
        'when no role is passed and tryToExtractRole fails but default flag is passed',
      shouldErr: false,
      options: {
        account: '012345678910/ALKSAdmin - awstest',
        default: true,
        iam: true,
      },
      shouldTryToExtractRole: true,
      tryToExtractRoleFails: true,
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '444455556666/ALKSPowerUser - awsthing',
        alksRole: 'PowerUser',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '444455556666/ALKSPowerUser - awsthing',
        alksRole: 'PowerUser',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
    },
    {
      ...defaultTestCase,
      description: 'when no account or role is passed',
      shouldErr: false,
      options: {
        iam: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: undefined,
        alksRole: undefined,
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '998877665544/ALKSReadOnly - awsother',
        alksRole: 'ReadOnly',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
    },
    {
      ...defaultTestCase,
      description:
        'when no account or role is passed but default flag is passed',
      shouldErr: false,
      options: {
        default: true,
        iam: true,
      },
      alksAccount: '444455556666/ALKSPowerUser - awsthing',
      alksRole: 'PowerUser',
      outputFormat: 'env',
      shouldGetIamKey: true,
      getIamKeyParams: {
        alksAccount: '444455556666/ALKSPowerUser - awsthing',
        alksRole: 'PowerUser',
        newSession: undefined,
        favorites: undefined,
        iamOnly: true,
        duration: undefined,
      },
      key: {
        alksAccount: '444455556666/ALKSPowerUser - awsthing',
        alksRole: 'PowerUser',
        isIAM: true,
        expires: new Date(),
        accessKey: 'abcd',
        secretKey: 'efgh',
        sessionToken: 'ijkl',
      },
      shouldGetKeyOutput: true,
      getKeyOutputParams: {
        format: 'env',
        profile: undefined,
        force: undefined,
      },
    },
  ];

  const fakeErrorSymbol = Symbol();

  for (const t of testCases) {
    describe(t.description, () => {
      let errorThrown = false;

      beforeEach(async () => {
        (checkForUpdate as jest.Mock).mockImplementation(async () => {
          if (t.checkForUpdateFails) {
            throw new Error();
          }
        });
        (errorAndExit as unknown as jest.Mock).mockImplementation(() => {
          errorThrown = true;

          // We have to throw an error to get execution to stop
          throw fakeErrorSymbol;
        });
        (tryToExtractRole as jest.Mock).mockImplementation(() => {
          if (t.tryToExtractRoleFails) {
            return undefined;
          } else {
            return t.extractedRole;
          }
        });
        (getAlksAccount as jest.Mock).mockImplementation(async () => {
          if (t.getAlksAccountFails) {
            throw new Error();
          } else {
            return t.alksAccount;
          }
        });
        (getAlksRole as jest.Mock).mockImplementation(async () => {
          if (t.getAlksRoleFails) {
            throw new Error();
          } else {
            return t.alksRole;
          }
        });
        (getOutputFormat as jest.Mock).mockImplementation(async () => {
          if (t.getOutputFormatFails) {
            throw new Error();
          } else {
            return t.outputFormat;
          }
        });
        (getIamKey as jest.Mock).mockImplementation(async () => {
          if (t.getIamKeyFails) {
            throw new Error();
          } else {
            return t.key;
          }
        });
        (getKeyOutput as jest.Mock).mockImplementation(() => {
          if (t.getKeyOutputFails) {
            throw new Error();
          } else {
            return t.keyOutput;
          }
        });

        try {
          await handleAlksSessionsOpen(t.options);
        } catch (e) {
          if (!(e === fakeErrorSymbol)) {
            throw e;
          }
        }
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

      if (t.shouldTryToExtractRole) {
        it('attempts to extract a role from the account string', () => {
          expect(tryToExtractRole).toHaveBeenCalledWith(t.options.account);
        });
      } else {
        it('does not attempt to extract a role from the account string', () => {
          expect(tryToExtractRole).not.toHaveBeenCalled();
        });
      }

      if (t.shouldGetIamKey) {
        it('attempts to fetch an IAM key', () => {
          expect(getIamKey).toHaveBeenCalledWith(
            t.getIamKeyParams.alksAccount,
            t.getIamKeyParams.alksRole,
            t.getIamKeyParams.newSession,
            t.getIamKeyParams.favorites,
            t.getIamKeyParams.iamOnly,
            t.getIamKeyParams.duration
          );
        });
      } else {
        it('does not attempt to fetch an IAM key', () => {
          expect(getIamKey).not.toHaveBeenCalled();
        });
      }

      if (t.shouldGetKeyOutput) {
        it('gets key output', () => {
          expect(getKeyOutput).toHaveBeenCalledWith(
            t.getKeyOutputParams.format,
            t.key,
            t.getKeyOutputParams.profile,
            t.getKeyOutputParams.force
          );
        });
      } else {
        it('does not get key output', () => {
          expect(getKeyOutput).not.toHaveBeenCalled();
        });
      }
    });
  }
});
