import commander from 'commander';
import { Key } from '../model/keys';
import { ensureConfigured } from './ensureConfigured';
import { getAlks } from './getAlks';
import { promptForAlksAccountAndRole } from './promptForAlksAccountAndRole';
import { getAuth } from './getAuth';
import { getIamKey } from './getIamKey';
import { getKeys } from './getKeys';
import { log } from './log';
import { addKey } from './addKey';
import ALKS from 'alks.js';
import moment from 'moment';
import { getAwsAccountFromString } from './getAwsAccountFromString';

jest.mock('./ensureConfigured');
jest.mock('./getAuth');
jest.mock('./promptForAlksAccountAndRole');
jest.mock('./log');
jest.mock('./getKeys');
jest.mock('./getAlks');
jest.mock('./addKey');
jest.mock('moment');
jest.mock('./getAwsAccountFromString');

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});

const date = new Date();
const defaultAccountId = '012345678910';
const defaultRole = 'Admin';
const passedAccountId = '999888777666';
const passedAccountAlias = 'awsother';
const passedAccount = `${passedAccountId}/ALKSReadOnly - ${passedAccountAlias}`;
const passedRole = 'ReadOnly';
const selectedAccountId = '444455556666';
const selectedAccountAlias = 'awsthing';
const selectedAccount = `${selectedAccountId}/ALKSPowerUser - ${selectedAccountAlias}`;
const selectedRole = 'PowerUser';

describe('getIamKey', () => {
  interface TestCase {
    description: string;
    program: commander.Command;
    alksAccount: string | undefined;
    alksRole: string | undefined;
    forceNewSession: boolean;
    filterFavorites: boolean;
    result: Key;
    shouldThrow: boolean;
    shouldGetAlksAccount: boolean;
    shouldSaveKey: boolean;
    ensureConfigured: typeof ensureConfigured;
    getAuth: typeof getAuth;
    promptForAlksAccountAndRole: typeof promptForAlksAccountAndRole;
    log: typeof log;
    getKeys: typeof getKeys;
    getAlks: typeof getAlks;
    addKey: typeof addKey;
    getAwsAccountFromString: typeof getAwsAccountFromString;
  }

  const defaultTestCase: Omit<TestCase, 'description'> = {
    program: {} as commander.Command,
    alksAccount: passedAccount,
    alksRole: passedRole,
    forceNewSession: false,
    filterFavorites: false,
    result: {
      alksAccount: passedAccountId,
      alksRole: passedRole,
      isIAM: true,
      accessKey: 'abcd',
      secretKey: 'efgh',
      sessionToken: 'ijkl',
      expires: date,
    },
    shouldThrow: false,
    shouldGetAlksAccount: false,
    shouldSaveKey: false,
    ensureConfigured: async () => {},
    getAuth: async () => ({
      token: 'thisisatoken',
    }),
    promptForAlksAccountAndRole: async () => ({
      alksAccount: selectedAccount,
      alksRole: selectedRole,
    }),
    log: async () => {},
    getKeys: async () => [],
    getAlks: async () =>
      ({
        getLoginRole: async ({ accountId, role }: ALKS.GetLoginRoleProps) => ({
          account: `${accountId}/ALKS${role}`,
          role,
          iamKeyActive: true,
          maxKeyDuration: 12,
          skypieaAccount: null,
        }),
        getIAMKeys: async () => ({
          accessKey: 'abcd',
          secretKey: 'efgh',
          sessionToken: 'ijkl',
          consoleURL: 'https://login.aws.com/my-account',
        }),
      } as unknown as ALKS.Alks),
    addKey: async () => {},
    getAwsAccountFromString: async () => ({
      id: passedAccountId,
      alias: passedAccountAlias,
      label: 'Some Account Label',
    }),
  };

  const testCases: TestCase[] = [
    {
      ...defaultTestCase,
      description: 'when not configured',
      shouldThrow: true,
      ensureConfigured: async () => {
        throw new Error();
      },
    },
    {
      ...defaultTestCase,
      description: 'when no keys exist',
      shouldSaveKey: true,
    },
    {
      ...defaultTestCase,
      description: 'when forceNewSession is true',
      forceNewSession: true,
      shouldSaveKey: true,
    },
    {
      ...defaultTestCase,
      description: 'when an existing session exists',
      getKeys: async () => [
        {
          alksAccount: passedAccountId,
          alksRole: passedRole,
          isIAM: true,
          expires: date,
          accessKey: 'oooo',
          secretKey: 'ohhh',
          sessionToken: 'ahhh',
          $loki: 0,
          meta: {
            created: 1,
            revision: 2,
            updated: 3,
            version: 4,
          },
        },
      ],
      result: {
        ...defaultTestCase.result,
        accessKey: 'oooo',
        secretKey: 'ohhh',
        sessionToken: 'ahhh',
      },
    },
    {
      ...defaultTestCase,
      description:
        'when an existing session exists but forceNewSession is true',
      forceNewSession: true,
      shouldSaveKey: true,
      getKeys: async () => [
        {
          alksAccount: passedAccountId,
          alksRole: passedRole,
          isIAM: true,
          expires: date,
          accessKey: 'oooo',
          secretKey: 'ohhh',
          sessionToken: 'ahhh',
          $loki: 0,
          meta: {
            created: 1,
            revision: 2,
            updated: 3,
            version: 4,
          },
        },
      ],
    },
    {
      ...defaultTestCase,
      description: 'when an existing session exists for the wrong account',
      shouldSaveKey: true,
      getKeys: async () => [
        {
          alksAccount: defaultAccountId,
          alksRole: defaultRole,
          isIAM: true,
          expires: date,
          accessKey: 'oooo',
          secretKey: 'ohhh',
          sessionToken: 'ahhh',
          $loki: 0,
          meta: {
            created: 1,
            revision: 2,
            updated: 3,
            version: 4,
          },
        },
      ],
    },
    {
      ...defaultTestCase,
      description: 'when multiple existing sessions exist',
      getKeys: async () => [
        {
          alksAccount: passedAccountId,
          alksRole: passedRole,
          isIAM: true,
          expires: date,
          accessKey: 'oooo',
          secretKey: 'ohhh',
          sessionToken: 'ahhh',
          $loki: 0,
          meta: {
            created: 1,
            revision: 2,
            updated: 3,
            version: 4,
          },
        },
        {
          alksAccount: passedAccountId,
          alksRole: passedRole,
          isIAM: true,
          expires: new Date(date.getTime() + 1),
          accessKey: 'zoo',
          secretKey: 'zaz',
          sessionToken: 'zba',
          $loki: 0,
          meta: {
            created: 1,
            revision: 2,
            updated: 3,
            version: 4,
          },
        },
      ],
      result: {
        ...defaultTestCase.result,
        accessKey: 'zoo',
        secretKey: 'zaz',
        sessionToken: 'zba',
        expires: new Date(date.getTime() + 1),
      },
    },
    {
      ...defaultTestCase,
      description: 'when no account or role is passed',
      shouldSaveKey: true,
      shouldGetAlksAccount: true,
      alksAccount: undefined,
      alksRole: undefined,
      result: {
        ...defaultTestCase.result,
        alksAccount: selectedAccountId,
        alksRole: selectedRole,
      },
      getAwsAccountFromString: async () => ({
        id: selectedAccountId,
        alias: selectedAccountAlias,
        label: 'Some Selected Account',
      }),
    },
    {
      ...defaultTestCase,
      description: 'when getting existing keys fails',
      getKeys: async () => {
        throw new Error();
      },
      shouldThrow: true,
    },
    {
      ...defaultTestCase,
      description: 'when alks.getLoginRole fails',
      getAlks: async () =>
        ({
          getLoginRole: async () => {
            throw new Error();
          },
          getIAMKeys: async () => {
            return (await defaultTestCase.getAlks({} as any)).getIAMKeys(
              {} as any
            );
          },
        } as unknown as ALKS.Alks),
      shouldThrow: true,
    },
    {
      ...defaultTestCase,
      description: 'when alks.getIAMKeys fails',
      getAlks: async () =>
        ({
          getLoginRole: async (props: ALKS.GetLoginRoleProps) => {
            return (await defaultTestCase.getAlks({} as any)).getLoginRole(
              props
            );
          },
          getIAMKeys: async () => {
            throw new Error();
          },
        } as unknown as ALKS.Alks),
      shouldThrow: true,
    },
    {
      ...defaultTestCase,
      description: 'when saving the key fails',
      addKey: async () => {
        throw new Error();
      },
      shouldSaveKey: true,
      shouldThrow: true,
    },
    {
      ...defaultTestCase,
      description: 'when no matching aws account is found',
      shouldThrow: true,
      getAwsAccountFromString: async () => undefined,
    },
  ];

  for (const t of testCases) {
    describe(t.description, () => {
      let result: Key;
      let errorThrown: boolean = false;

      beforeEach(async () => {
        (ensureConfigured as jest.Mock).mockImplementation(t.ensureConfigured);
        (getAuth as jest.Mock).mockImplementation(t.getAuth);
        (promptForAlksAccountAndRole as jest.Mock).mockImplementation(
          t.promptForAlksAccountAndRole
        );
        (log as jest.Mock).mockImplementation(t.log);
        (getKeys as jest.Mock).mockImplementation(t.getKeys);
        (getAlks as jest.Mock).mockImplementation(t.getAlks);
        (addKey as jest.Mock).mockImplementation(t.addKey);
        (moment as unknown as jest.Mock).mockImplementation(() => {
          const moment = {} as any;
          moment.add = () => moment;
          moment.toDate = () => date;
          return moment;
        });
        (getAwsAccountFromString as jest.Mock).mockImplementation(
          t.getAwsAccountFromString
        );

        try {
          result = await getIamKey(
            t.alksAccount,
            t.alksRole,
            t.forceNewSession,
            t.filterFavorites
          );
        } catch (err) {
          console.error(err);
          errorThrown = true;
        }
      });

      if (t.shouldThrow) {
        it('rejects with an error', () => {
          expect(errorThrown).toBe(true);
        });
      } else {
        it('resolves with the correct key', () => {
          expect(result).toEqual(expect.objectContaining(t.result));
        });
      }

      if (t.shouldGetAlksAccount) {
        it('calls promptForAlksAccountAndRole to ask for an ALKS account and role', () => {
          expect(promptForAlksAccountAndRole).toHaveBeenCalledWith({
            iamOnly: true,
            filterFavorites: t.filterFavorites,
          });
        });
      } else {
        it('does not call getAlksAccount', () => {
          expect(promptForAlksAccountAndRole).not.toHaveBeenCalled();
        });
      }

      if (t.shouldSaveKey) {
        it('saves the key for later use', () => {
          expect(addKey).toHaveBeenCalledWith(
            t.result.accessKey,
            t.result.secretKey,
            t.result.sessionToken,
            t.result.alksAccount,
            t.result.alksRole,
            t.result.expires,
            expect.any(Object),
            t.result.isIAM
          );
        });
      } else {
        it('does not save the key for later use', () => {
          expect(addKey).not.toHaveBeenCalled();
        });
      }
    });
  }
});
