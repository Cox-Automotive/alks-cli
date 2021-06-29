import commander from 'commander';
import { Key } from '../model/keys';
import { ensureConfigured } from './ensureConfigured';
import { getAlks } from './getAlks';
import { promptForAlksAccountAndRole } from './promptForAlksAccountAndRole';
import { getAuth } from './getAuth';
import { getIamKey } from './getIamKey';
import { getKeys } from './getKeys';
import { log } from './log';
import { getBadAccountMessage } from './getBadAccountMessage';
import { addKey } from './addKey';
import ALKS from 'alks.js';
import moment from 'moment';

jest.mock('./ensureConfigured');
jest.mock('./getAuth');
jest.mock('./promptForAlksAccountAndRole');
jest.mock('./log');
jest.mock('./getKeys');
jest.mock('./getAlks');
jest.mock('./getBadAccountMessage');
jest.mock('./addKey');
jest.mock('moment');

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});

const date = new Date();
const defaultAccount = '012345678910/ALKSAdmin - awstest';
const defaultRole = 'Admin';
const passedAccount = '999888777666/ALKSReadOnly - awsother';
const passedRole = 'ReadOnly';
const selectedAccount = '444455556666/ALKSPowerUser - awsthing';
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
    getAlksAccount: typeof promptForAlksAccountAndRole;
    log: typeof log;
    getKeys: typeof getKeys;
    getAlks: typeof getAlks;
    getBadAccountMessage: typeof getBadAccountMessage;
    addKey: typeof addKey;
  }

  const defaultTestCase: Omit<TestCase, 'description'> = {
    program: {} as commander.Command,
    alksAccount: passedAccount,
    alksRole: passedRole,
    forceNewSession: false,
    filterFavorites: false,
    result: {
      alksAccount: passedAccount,
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
    getAlksAccount: async () => ({
      alksAccount: selectedAccount,
      alksRole: selectedRole,
    }),
    log: async () => {},
    getKeys: async () => [],
    getAlks: async () =>
      (({
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
      } as unknown) as ALKS.Alks),
    getBadAccountMessage: () => 'Bad Account',
    addKey: async () => {},
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
          alksAccount: passedAccount,
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
          alksAccount: passedAccount,
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
          alksAccount: defaultAccount,
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
          alksAccount: passedAccount,
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
          alksAccount: passedAccount,
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
        alksAccount: selectedAccount,
        alksRole: selectedRole,
      },
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
        (({
          getLoginRole: async () => {
            throw new Error();
          },
          getIAMKeys: async () => {
            return (await defaultTestCase.getAlks({} as any)).getIAMKeys(
              {} as any
            );
          },
        } as unknown) as ALKS.Alks),
      shouldThrow: true,
    },
    {
      ...defaultTestCase,
      description: 'when alks.getIAMKeys fails',
      getAlks: async () =>
        (({
          getLoginRole: async (props: ALKS.GetLoginRoleProps) => {
            return (await defaultTestCase.getAlks({} as any)).getLoginRole(
              props
            );
          },
          getIAMKeys: async () => {
            throw new Error();
          },
        } as unknown) as ALKS.Alks),
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
  ];

  for (const t of testCases) {
    describe(t.description, () => {
      let result: Key;
      let errorThrown: boolean = false;

      beforeEach(async () => {
        (ensureConfigured as jest.Mock).mockImplementation(t.ensureConfigured);
        (getAuth as jest.Mock).mockImplementation(t.getAuth);
        (promptForAlksAccountAndRole as jest.Mock).mockImplementation(
          t.getAlksAccount
        );
        (log as jest.Mock).mockImplementation(t.log);
        (getKeys as jest.Mock).mockImplementation(t.getKeys);
        (getAlks as jest.Mock).mockImplementation(t.getAlks);
        (getBadAccountMessage as jest.Mock).mockImplementation(
          t.getBadAccountMessage
        );
        (addKey as jest.Mock).mockImplementation(t.addKey);
        ((moment as unknown) as jest.Mock).mockImplementation(() => {
          const moment = {} as any;
          moment.add = () => moment;
          moment.toDate = () => date;
          return moment;
        });

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
