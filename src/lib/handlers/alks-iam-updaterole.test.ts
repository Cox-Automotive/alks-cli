import { OptionValues } from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { unpackTags } from '../unpackTags';
import { extractAccountAndRole } from '../extractAccountAndRole';
import ALKS from 'alks.js';
import { handleAlksIamUpdateRole } from './alks-iam-updaterole';
import { Auth } from '../../model/auth';

jest.mock('../errorAndExit', () => ({
  __esModule: true,
  errorAndExit: jest.fn(),
}));

jest.mock('../checkForUpdate', () => ({
  __esModule: true,
  checkForUpdate: jest.fn(),
}));

jest.mock('../getAuth', () => ({
  __esModule: true,
  getAuth: jest.fn(),
}));

jest.mock('../getAlks', () => ({
  __esModule: true,
  getAlks: jest.fn(),
}));

jest.mock('../log', () => ({
  __esModule: true,
  log: jest.fn(),
}));

jest.mock('../unpackTags', () => ({
  __esModule: true,
  unpackTags: jest.fn(),
}));

jest.mock('../extractAccountAndRole', () => ({
  __esModule: true,
  extractAccountAndRole: jest.fn(),
}));

describe('handleAlksIamUpdateRole', () => {
  interface TestCase {
    description: string;
    options: OptionValues;
    shouldExitWithFailure: boolean;
    updateRoleParameters?: ALKS.UpdateRoleProps;
    errorAndExit: typeof errorAndExit;
    unpackTags: typeof unpackTags;
    extractAccountAndRole: typeof extractAccountAndRole;
    getAuth: typeof getAuth;
    getAlks: typeof getAlks;
    log: typeof log;
    checkForUpdate: typeof checkForUpdate;
  }

  const mockAlks: Partial<ALKS.Alks> = {
    updateRole: jest.fn(),
  };

  const testCaseDefaults = {
    shouldExitWithFailure: false,
    errorAndExit: jest.fn(() => {
      throw new Error('exit');
    }) as unknown as typeof errorAndExit,
    unpackTags: jest.fn(),
    extractAccountAndRole: jest.fn(),
    getAuth: jest.fn(),
    getAlks: jest.fn(async () => mockAlks as ALKS.Alks),
    log: jest.fn(),
    checkForUpdate: jest.fn(),
  };

  const testCases: TestCase[] = [
    {
      ...testCaseDefaults,
      description:
        'when all necessary fields as well as a trust policy and tags are provided',
      options: {
        account: '012345678910',
        role: 'Admin',
        rolename: 'myTestRole',
        trustPolicy: '{}',
        tags: ['key=value'],
      },
      updateRoleParameters: {
        account: '012345678910',
        role: 'Admin',
        roleName: 'myTestRole',
        trustPolicy: {},
        tags: [
          {
            key: 'key',
            value: 'value',
          },
        ],
      },
      unpackTags: (tags) => {
        if (Array.isArray(tags) && tags.length > 0 && tags[0] === 'key=value') {
          return [
            {
              key: 'key',
              value: 'value',
            },
          ];
        }
        throw new Error('incorrect tags');
      },
      extractAccountAndRole: async ({ account, role }) => {
        if (account === '012345678910' && role === 'Admin') {
          return {
            awsAccount: {
              id: '012345678910',
              alias: 'awstest123',
              label: 'Test 123 - Prod',
            },
            role: 'Admin',
          };
        }
        throw new Error('failed to extract account and role');
      },
      getAuth: async () => ({} as Auth),
    },
  ];

  for (const t of testCases) {
    describe(t.description, () => {
      beforeEach(async () => {
        (errorAndExit as unknown as jest.Mock).mockImplementation(
          t.errorAndExit
        );
        (unpackTags as unknown as jest.Mock).mockImplementation(t.unpackTags);
        (extractAccountAndRole as unknown as jest.Mock).mockImplementation(
          t.extractAccountAndRole
        );
        (getAuth as unknown as jest.Mock).mockImplementation(t.getAuth);
        (getAlks as unknown as jest.Mock).mockImplementation(t.getAlks);
        (log as jest.Mock).mockImplementation(t.log);
        (checkForUpdate as unknown as jest.Mock).mockImplementation(
          t.checkForUpdate
        );

        try {
          await handleAlksIamUpdateRole(t.options);
        } catch {}
      });

      afterEach(() => {
        (errorAndExit as unknown as jest.Mock).mockReset();
        (unpackTags as unknown as jest.Mock).mockReset();
        (extractAccountAndRole as unknown as jest.Mock).mockReset();
        (getAuth as unknown as jest.Mock).mockReset();
        (getAlks as unknown as jest.Mock).mockReset();
        (log as jest.Mock).mockReset();
        (checkForUpdate as unknown as jest.Mock).mockReset();
      });

      if (t.shouldExitWithFailure) {
        it('exits early with an error', () => {
          expect(errorAndExit).toBeCalled();
        });
      } else {
        it('should execute without error', () => {
          expect(errorAndExit).not.toHaveBeenCalled();
        });

        it('should call alks.updateRole with the correct parameters', () => {
          expect(mockAlks.updateRole).toHaveBeenCalledWith(
            t.updateRoleParameters
          );
        });
      }
    });
  }
});
