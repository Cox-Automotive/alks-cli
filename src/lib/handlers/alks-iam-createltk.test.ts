import ALKS from 'alks.js';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { handleAlksIamCreateLtk } from './alks-iam-createltk';
import { tryToExtractRole } from '../tryToExtractRole';
import { getAwsAccountFromString } from '../getAwsAccountFromString';

jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../getAlks');
jest.mock('../getAuth');
jest.mock('alks.js');
jest.mock('../promptForAlksAccountAndRole');
jest.mock('../tryToExtractRole');
jest.mock('../getAwsAccountFromString');

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});

// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('handleAlksIamCreateLtk', () => {
  interface TestCase {
    description: string;
    options: commander.OptionValues;
    alksAccount: string;
    alksRole: string;
    shouldErr: boolean;
    checkForUpdateFails: boolean;
    shouldCreateLTK: boolean;
    extractedRole: string;
    createLTKParams: {
      account: string | undefined;
      role: string | undefined;
      iamUserName: string | undefined;
      tags?: ALKS.Tag[] | undefined;
    };
    createLTKOutputParams: {
      accessKey: string | undefined;
      secretKey: string | undefined;
      iamUserName: string | undefined;
      iamUserArn: string | undefined;
    };
    getAwsAccountFromString: typeof getAwsAccountFromString;
  }
  const defaultTestCase: Omit<TestCase, 'description'> = {
    options: {} as commander.OptionValues,
    alksAccount: '',
    alksRole: '',
    shouldErr: false,
    checkForUpdateFails: false,
    shouldCreateLTK: true,
    extractedRole: '',
    createLTKParams: {
      account: '',
      role: '',
      iamUserName: '',
      tags: undefined,
    },
    createLTKOutputParams: {
      accessKey: 'defaultAccessKey',
      secretKey: 'defaultSecretKey',
      iamUserName: 'defaultIamUserName',
      iamUserArn: 'defaultIamUserArn',
    },
    getAwsAccountFromString: async () => undefined,
  };
  const testCases: TestCase[] = [
    {
      ...defaultTestCase,
      description: 'when no tags nor empty list is provided',
      shouldErr: false,
      shouldCreateLTK: true,
      options: {
        account: '111111111111',
        role: 'Role',
        iamusername: 'goodIamUserName',
      },
      createLTKParams: {
        account: '111111111111',
        role: 'Role',
        iamUserName: 'goodIamUserName',
      },
      getAwsAccountFromString: async () => ({
        id: '111111111111',
        alias: 'awsone',
        label: 'One - Prod',
      }),
    },
    {
      ...defaultTestCase,
      description: 'when empty list of tags is supplied',
      shouldErr: false,
      options: {
        account: '111111111111',
        role: 'Role',
        iamusername: 'goodIamUserName',
        tags: [],
      },
      createLTKParams: {
        account: '111111111111',
        role: 'Role',
        iamUserName: 'goodIamUserName',
        tags: [],
      },
      getAwsAccountFromString: async () => ({
        id: '111111111111',
        alias: 'awsone',
        label: 'One - Prod',
      }),
    },
    {
      ...defaultTestCase,
      description: 'when no username is supplied',
      shouldErr: true,
      shouldCreateLTK: false,
      options: {
        account: '111111111111',
        role: 'AlksRole',
        tags: [],
      },
      getAwsAccountFromString: async () => ({
        id: '111111111111',
        alias: 'awsone',
        label: 'One - Prod',
      }),
    },
    {
      ...defaultTestCase,
      description: 'When good data is supplied',
      shouldErr: false,
      options: {
        account: '111111111111',
        role: 'Role',
        iamusername: 'goodIamUserName',
        tags: [
          '{"Key":"key1", "Value":"val1"}',
          '{"Key":"key2", "Value":"val2"}',
        ],
      },
      createLTKParams: {
        account: '111111111111',
        role: 'Role',
        iamUserName: 'goodIamUserName',
        tags: [
          {
            key: 'key1',
            value: 'val1',
          },
          {
            key: 'key2',
            value: 'val2',
          },
        ],
      },
      getAwsAccountFromString: async () => ({
        id: '111111111111',
        alias: 'awsone',
        label: 'One - Prod',
      }),
    },
    {
      ...defaultTestCase,
      description: 'When Account has role and no role supplied',
      shouldErr: false,
      alksAccount: '111111111111/ALKSRole',
      alksRole: 'Role',
      options: {
        account: '111111111111/AlksRole',
        iamusername: 'goodIamUserName',
        tags: [
          '{"Key":"key1", "Value":"val1"}',
          '{"Key":"key2", "Value":"val2"}',
        ],
      },
      createLTKParams: {
        account: '111111111111',
        role: 'Role',
        iamUserName: 'goodIamUserName',
        tags: [
          {
            key: 'key1',
            value: 'val1',
          },
          {
            key: 'key2',
            value: 'val2',
          },
        ],
      },
      getAwsAccountFromString: async () => ({
        id: '111111111111',
        alias: 'awsone',
        label: 'One - Prod',
      }),
    },
    {
      ...defaultTestCase,
      description: 'When account is supplied with accountID and roleName',
      shouldErr: false,
      extractedRole: 'Role',
      options: {
        account: '111111111112/ALKSRole',
        iamusername: 'goodIamUserName',
        tags: [
          '{"Key":"key1", "Value":"val1"}',
          '{"Key":"key2", "Value":"val2"}',
        ],
      },
      createLTKParams: {
        account: '111111111112',
        role: 'Role',
        iamUserName: 'goodIamUserName',
        tags: [
          {
            key: 'key1',
            value: 'val1',
          },
          {
            key: 'key2',
            value: 'val2',
          },
        ],
      },
      getAwsAccountFromString: async () => ({
        id: '111111111112',
        alias: 'awstwo',
        label: 'Two - Prod',
      }),
    },
    {
      ...defaultTestCase,
      description: 'When no matching account is found',
      shouldErr: true,
      extractedRole: 'Role',
      options: {
        account: '111111111112/ALKSRole',
        iamusername: 'goodIamUserName',
        tags: [
          '{"Key":"key1", "Value":"val1"}',
          '{"Key":"key2", "Value":"val2"}',
        ],
      },
      shouldCreateLTK: false,
      getAwsAccountFromString: async () => undefined,
    },
  ];

  const fakeErrorSymbol = Symbol();

  const mockAlks = {
    createAccessKeys: jest.fn(),
  } as unknown as ALKS.Alks;

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
          throw fakeErrorSymbol;
        });
        (tryToExtractRole as jest.Mock).mockImplementation(() => {
          return t.extractedRole;
        });
        (promptForAlksAccountAndRole as jest.Mock).mockImplementation(() => {
          console.log('Prompting for alks account and role???');
          return {
            alksAccount: t.alksAccount,
            alksRole: t.alksRole,
          };
        });
        (getAuth as jest.Mock).mockImplementation(() => {
          return { accessToken: 'token' };
        });
        (getAlks as jest.Mock).mockImplementation(() => {
          return mockAlks;
        });
        (mockAlks.createAccessKeys as jest.Mock).mockImplementation(() => {
          return t.createLTKOutputParams;
        });
        (getAwsAccountFromString as jest.Mock).mockImplementation(
          t.getAwsAccountFromString
        );

        try {
          await handleAlksIamCreateLtk(t.options);
        } catch (e) {
          if (!(e === fakeErrorSymbol)) {
            throw e;
          }
        }
      });
      afterEach(async () => {
        (checkForUpdate as jest.Mock).mockReset();
        (errorAndExit as unknown as jest.Mock).mockReset();
        (promptForAlksAccountAndRole as jest.Mock).mockReset();
        (getAuth as jest.Mock).mockReset();
        (getAlks as jest.Mock).mockReset();
        (mockAlks.createAccessKeys as jest.Mock).mockReset();
        (tryToExtractRole as jest.Mock).mockReset();
        (getAwsAccountFromString as jest.Mock).mockReset();
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

      if (t.shouldCreateLTK) {
        it('creates IAM User', () => {
          expect(mockAlks.createAccessKeys).toHaveBeenCalledWith(
            t.createLTKParams
          );
        });
      } else {
        it('does not create ltk', () => {
          expect(mockAlks.createAccessKeys).not.toHaveBeenCalled();
        });
      }
    });
  }
});
