import ALKS from 'alks.js';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { getAwsAccountFromString } from '../getAwsAccountFromString';
import { handleAlksIamUpdateIamUser } from './alks-iam-updateiamuser';

jest.mock('../errorAndExit');
jest.mock('../checkForUpdate');
jest.mock('../getAlks');
jest.mock('../getAuth');
jest.mock('alks.js');
jest.mock('../getAwsAccountFromString');

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});

// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('handleAlksIamUpdateIamUser', () => {
  interface TestCase {
    description: string;
    options: commander.OptionValues;
    shouldErr: boolean;
    checkForUpdateFails: boolean;
    shouldUpdateIamUser: boolean;
    updateIamUserParams: {
      account: string | undefined;
      iamUserName: string | undefined;
      tags: ALKS.Tag[] | undefined;
    };
    updateIamUserOutputParams: {
      accountId: string | undefined;
      accessKey: string | undefined;
      iamUserName: string | undefined;
      iamUserArn: string | undefined;
      tags: ALKS.Tag[] | undefined;
    };
    getAwsAccountFromString: typeof getAwsAccountFromString;
  }
  const defaultTestCase: Omit<TestCase, 'description'> = {
    options: {} as commander.OptionValues,
    shouldErr: false,
    checkForUpdateFails: false,
    shouldUpdateIamUser: true,
    updateIamUserParams: {
      account: '',
      iamUserName: '',
      tags: undefined,
    },
    updateIamUserOutputParams: {
      accountId: '',
      accessKey: '',
      iamUserName: '',
      iamUserArn: '',
      tags: undefined,
    },
    getAwsAccountFromString: async () => undefined,
  };
  const testCases: TestCase[] = [
    {
      ...defaultTestCase,
      description: 'when bad accountId is supplied',
      shouldErr: true,
      shouldUpdateIamUser: false,
      options: {
        account: 'badAccountId',
        iamusername: 'goodIamUserName',
        tags: [
          '{"Key":"key1", "Value":"val1"}',
          '{"Key":"key2", "Value":"val2"}',
        ],
      },
    },
    {
      ...defaultTestCase,
      description: 'when no tags nor empty list is provided',
      shouldErr: true,
      shouldUpdateIamUser: false,
      options: {
        account: '111111111111',
        iamusername: 'goodIamUserName',
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
        iamusername: 'goodIamUserName',
        tags: [],
      },
      updateIamUserParams: {
        account: '111111111111',
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
      shouldUpdateIamUser: false,
      options: {
        account: '111111111111',
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
        iamusername: 'goodIamUserName',
        tags: [
          '{"Key":"key1", "Value":"val1"}',
          '{"Key":"key2", "Value":"val2"}',
        ],
      },
      updateIamUserParams: {
        account: '111111111111',
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
      options: {
        account: '111111111111/ALKSRole',
        iamusername: 'goodIamUserName',
        tags: [
          '{"Key":"key1", "Value":"val1"}',
          '{"Key":"key2", "Value":"val2"}',
        ],
      },
      updateIamUserParams: {
        account: '111111111111',
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
  ];

  const fakeErrorSymbol = Symbol();

  const mockAlks = {
    updateIamUser: jest.fn(),
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
        (getAuth as jest.Mock).mockImplementation(() => {
          return { accessToken: 'token' };
        });
        (getAlks as jest.Mock).mockImplementation(() => {
          return mockAlks;
        });
        (mockAlks.updateIamUser as jest.Mock).mockImplementation(() => {
          return t.updateIamUserOutputParams;
        });

        try {
          await handleAlksIamUpdateIamUser(t.options);
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

      if (t.shouldUpdateIamUser) {
        it('updates IAM User', () => {
          expect(mockAlks.updateIamUser).toHaveBeenCalledWith(
            t.updateIamUserParams
          );
        });
      } else {
        it('does not get key output', () => {
          expect(mockAlks.updateIamUser).not.toHaveBeenCalled();
        });
      }
    });
  }
});
