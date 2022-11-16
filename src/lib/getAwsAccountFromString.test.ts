import { getAwsAccountFromString } from './getAwsAccountFromString';
import { getAlksAccounts } from './getAlksAccounts';

jest.mock('./getAlksAccounts');

interface TestCase {
  description: string;
  alksAccount: string;
  result: Awaited<ReturnType<typeof getAwsAccountFromString>>;
  shouldThrow: boolean;
  getAlksAccounts: typeof getAlksAccounts;
}

const defaultTestCase: Omit<TestCase, 'description' | 'alksAccount'> = {
  result: undefined,
  shouldThrow: false,
  getAlksAccounts: async () => [],
};

const firstAccountId = '012345678910';
const firstAccountAlias = 'awsfirst';
const firstAccountLabel = 'First - Prod';
const secondAccountId = '200020002000';
const secondAccountAlias = 'awssecond';
const secondAccountLabel = 'Second - Prod';

function fakeAlksAccount(
  id: string,
  alias: string,
  label: string,
  role: string
) {
  return {
    account: `${id}/ALKS${role} - ${alias}`,
    role,
    iamKeyActive: true,
    maxKeyDuration: 1,
    securityLevel: '1',
    skypieaAccount: {
      label,
      accountOwners: [],
      cloudsploitTrend: [],
    },
  };
}

const testCases: TestCase[] = [
  {
    ...defaultTestCase,
    description: 'when an empty string is passed and no accounts match',
    alksAccount: '',
    result: undefined,
  },
  {
    ...defaultTestCase,
    description:
      'when an account id is passed but there are no accounts to match',
    alksAccount: firstAccountId,
    result: undefined,
  },
  {
    ...defaultTestCase,
    description: 'when an account id is passed and there is a match',
    alksAccount: firstAccountId,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Admin'
      ),
    ],
    result: {
      id: firstAccountId,
      alias: firstAccountAlias,
      label: firstAccountLabel,
    },
  },
  {
    ...defaultTestCase,
    description: 'when an account id is passed and there are multiple matches',
    alksAccount: firstAccountId,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Admin'
      ),
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Security'
      ),
    ],
    result: {
      id: firstAccountId,
      alias: firstAccountAlias,
      label: firstAccountLabel,
    },
  },
  {
    ...defaultTestCase,
    description: 'when an account id is passed and there are no matches',
    alksAccount: firstAccountId,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        secondAccountId,
        secondAccountAlias,
        secondAccountLabel,
        'Admin'
      ),
      fakeAlksAccount(
        secondAccountId,
        secondAccountAlias,
        secondAccountLabel,
        'Security'
      ),
    ],
    result: undefined,
  },
  {
    ...defaultTestCase,
    description: 'when an alias is passed and there is a match',
    alksAccount: firstAccountAlias,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Admin'
      ),
    ],
    result: {
      id: firstAccountId,
      alias: firstAccountAlias,
      label: firstAccountLabel,
    },
  },
  {
    ...defaultTestCase,
    description: 'when an alias is passed and there are multiple matches',
    alksAccount: firstAccountAlias,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Admin'
      ),
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Security'
      ),
    ],
    result: {
      id: firstAccountId,
      alias: firstAccountAlias,
      label: firstAccountLabel,
    },
  },
  {
    ...defaultTestCase,
    description: 'when an alias is passed and there are no matches',
    alksAccount: firstAccountAlias,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        secondAccountId,
        secondAccountAlias,
        secondAccountLabel,
        'Admin'
      ),
      fakeAlksAccount(
        secondAccountId,
        secondAccountAlias,
        secondAccountLabel,
        'Security'
      ),
    ],
    result: undefined,
  },
  {
    ...defaultTestCase,
    description: 'when an account string is passed and there is a match',
    alksAccount: `${firstAccountId}/ALKSAdmin - ${firstAccountAlias}`,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Admin'
      ),
    ],
    result: {
      id: firstAccountId,
      alias: firstAccountAlias,
      label: firstAccountLabel,
    },
  },
  {
    ...defaultTestCase,
    description:
      'when an account string is passed and there are multiple matches',
    alksAccount: `${firstAccountId}/ALKSAdmin - ${firstAccountAlias}`,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Admin'
      ),
      fakeAlksAccount(
        firstAccountId,
        firstAccountAlias,
        firstAccountLabel,
        'Security'
      ),
    ],
    result: {
      id: firstAccountId,
      alias: firstAccountAlias,
      label: firstAccountLabel,
    },
  },
  {
    ...defaultTestCase,
    description: 'when an account string is passed and there are no matches',
    alksAccount: `${firstAccountId}/ALKSAdmin - ${firstAccountAlias}`,
    getAlksAccounts: async () => [
      fakeAlksAccount(
        secondAccountId,
        secondAccountAlias,
        secondAccountLabel,
        'Admin'
      ),
      fakeAlksAccount(
        secondAccountId,
        secondAccountAlias,
        secondAccountLabel,
        'Security'
      ),
    ],
    result: undefined,
  },
];

describe('getAwsAccountFromString', () => {
  for (const t of testCases) {
    describe(t.description, () => {
      let result: Awaited<ReturnType<typeof getAwsAccountFromString>>;
      let errorThrown: boolean = false;

      beforeEach(async () => {
        (getAlksAccounts as jest.Mock).mockImplementation(t.getAlksAccounts);

        try {
          result = await getAwsAccountFromString(t.alksAccount);
        } catch (e) {
          errorThrown = true;
        }
      });

      if (t.shouldThrow) {
        it('throws an error', () => {
          expect(errorThrown).toBe(true);
        });
      } else {
        it(`doesn't throw an error`, () => {
          expect(errorThrown).toBe(false);
        });

        it('returns the correct result', () => {
          expect(result).toEqual(t.result);
        });
      }
    });
  }
});
