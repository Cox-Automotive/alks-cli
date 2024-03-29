import { OptionValues } from 'commander';
import { AwsAccount } from '../model/awsAccount';
import { extractAccountAndRole } from './extractAccountAndRole';
import { log } from './log';
import { tryToExtractRole } from './tryToExtractRole';
import { promptForAlksAccountAndRole } from './promptForAlksAccountAndRole';
import { getAwsAccountFromString } from './getAwsAccountFromString';

jest.mock('./log', () => ({
  __esModule: true,
  log: jest.fn(),
}));

jest.mock('./tryToExtractRole', () => ({
  __esModule: true,
  tryToExtractRole: jest.fn(),
}));

jest.mock('./promptForAlksAccountAndRole', () => ({
  __esModule: true,
  promptForAlksAccountAndRole: jest.fn(),
}));

jest.mock('./getAwsAccountFromString', () => ({
  __esModule: true,
  getAwsAccountFromString: jest.fn(),
}));

describe('extractAccountAndRole', () => {
  interface TestCase {
    description: string;
    options: OptionValues;
    resultAccount: AwsAccount;
    resultRole: string;
    shouldThrow: boolean;
    log: typeof log;
    tryToExtractRole: typeof tryToExtractRole;
    promptForAlksAccountAndRole: typeof promptForAlksAccountAndRole;
    getAwsAccountFromString: typeof getAwsAccountFromString;
  }

  const testCaseDefaults = {
    shouldThrow: false,
    log: jest.fn(),
    tryToExtractRole: jest.fn(),
    promptForAlksAccountAndRole: jest.fn(),
    getAwsAccountFromString: jest.fn(),
  };

  const testCases: TestCase[] = [
    {
      ...testCaseDefaults,
      description: 'when an account and role are provided',
      options: {
        account: '012345678910',
        role: 'Admin',
      },
      resultAccount: {
        id: '012345678910',
        alias: 'awstest123',
        label: 'Test 123 - Prod',
      },
      resultRole: 'Admin',
      getAwsAccountFromString: async (account) => {
        if (account === '012345678910') {
          return {
            id: '012345678910',
            alias: 'awstest123',
            label: 'Test 123 - Prod',
          };
        }
        throw new Error('no account found');
      },
    },
    {
      ...testCaseDefaults,
      description:
        'when an account and role are provided but no matching account is found',
      options: {
        account: '012345678910',
        role: 'Admin',
      },
      resultAccount: {
        id: '012345678910',
        alias: 'awstest123',
        label: 'Test 123 - Prod',
      },
      resultRole: 'Admin',
      shouldThrow: true,
      getAwsAccountFromString: async () => {
        throw new Error('invalid account');
      },
    },
    {
      ...testCaseDefaults,
      description:
        'when only an account string is provided containing the role in the string',
      options: {
        account: '012345678910/ALKSAdmin',
      },
      resultAccount: {
        id: '012345678910',
        alias: 'awstest123',
        label: 'Test 123 - Prod',
      },
      resultRole: 'Admin',
      tryToExtractRole: (account) => {
        if (account === '012345678910/ALKSAdmin') {
          return 'Admin';
        }
        throw new Error('no role found');
      },
      getAwsAccountFromString: async (account) => {
        if (account === '012345678910/ALKSAdmin') {
          return {
            id: '012345678910',
            alias: 'awstest123',
            label: 'Test 123 - Prod',
          };
        }
        throw new Error('no account found');
      },
    },
    {
      ...testCaseDefaults,
      description: 'when only an account id is provided',
      options: {
        account: '012345678910',
      },
      resultAccount: {
        id: '012345678910',
        alias: 'awstest123',
        label: 'Test 123 - Prod',
      },
      resultRole: 'Admin',
      tryToExtractRole: () => undefined,
      promptForAlksAccountAndRole: async () => ({
        alksAccount: '012345678910',
        alksRole: 'Admin',
      }),
      getAwsAccountFromString: async (account) => {
        if (account === '012345678910') {
          return {
            id: '012345678910',
            alias: 'awstest123',
            label: 'Test 123 - Prod',
          };
        }
        throw new Error('no account found');
      },
    },
    {
      ...testCaseDefaults,
      description: 'when no account or role are provided',
      options: {},
      resultAccount: {
        id: '012345678910',
        alias: 'awstest123',
        label: 'Test 123 - Prod',
      },
      resultRole: 'Admin',
      promptForAlksAccountAndRole: async () => ({
        alksAccount: '012345678910',
        alksRole: 'Admin',
      }),
      getAwsAccountFromString: async (account) => {
        if (account === '012345678910') {
          return {
            id: '012345678910',
            alias: 'awstest123',
            label: 'Test 123 - Prod',
          };
        }
        throw new Error('no account found');
      },
    },
  ];

  for (const t of testCases) {
    describe(t.description, () => {
      let result: Awaited<ReturnType<typeof extractAccountAndRole>>;
      let exception: unknown;

      beforeEach(async () => {
        (log as jest.Mock).mockImplementation(t.log);
        (tryToExtractRole as jest.Mock).mockImplementation(t.tryToExtractRole);
        (promptForAlksAccountAndRole as jest.Mock).mockImplementation(
          t.promptForAlksAccountAndRole
        );
        (getAwsAccountFromString as jest.Mock).mockImplementation(
          t.getAwsAccountFromString
        );

        try {
          result = await extractAccountAndRole(t.options);
        } catch (e) {
          exception = e;
        }
      });

      afterEach(() => {
        (log as jest.Mock).mockReset();
        (tryToExtractRole as jest.Mock).mockReset();
        (promptForAlksAccountAndRole as jest.Mock).mockReset();
        (getAwsAccountFromString as jest.Mock).mockReset();
      });

      if (t.shouldThrow) {
        it('throws an exception', () => {
          expect(exception).toBeInstanceOf(Error);
        });
      } else {
        it('returns the correct result', () => {
          expect(result.awsAccount).toEqual(t.resultAccount);
          expect(result.role).toEqual(t.resultRole);
        });
      }
    });
  }
});
