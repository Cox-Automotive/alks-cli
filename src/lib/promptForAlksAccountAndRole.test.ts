import { promptForAlksAccountAndRole } from './promptForAlksAccountAndRole';
import { getAlksAccounts } from './getAlksAccounts';
import { getFavorites } from './getFavorites';
import { getStdErrPrompt } from './getStdErrPrompt';
import { getAlksAccount } from './state/alksAccount';
import { getAlksRole } from './state/alksRole';

jest.mock('./getAlksAccounts');
jest.mock('./getFavorites');
jest.mock('./getStdErrPrompt');
jest.mock('./state/alksAccount');
jest.mock('./state/alksRole');

describe('promptForAlksAccountAndRole', () => {
  const mockAccounts = [
    { account: '123456789012/ALKSReadOnly - devaccount1', role: 'ReadOnly' },
    {
      account: '111111111111/ALKSReadOnly - testenv2',
      role: 'ReadOnly',
    },
    { account: '987654321098/ALKSAdmin - prodbridge1', role: 'Admin' },
    {
      account: '456789012345/ALKSReadOnly - stagingcell2',
      role: 'ReadOnly',
    },
    {
      account: '789012345678/ALKSReadOnlyPlusApproval - operations',
      role: 'ReadOnlyPlusApproval',
    },
    {
      account: '345678901234/ALKSReadOnly - clientmgmt1',
      role: 'ReadOnly',
    },
    { account: '678901234567/ALKSAdmin - clientstaging', role: 'Admin' },
    {
      account: '234567890123/ALKSReadOnly - sharedservices',
      role: 'ReadOnly',
    },
    {
      account: '567890123456/ALKSReadOnly - commontools',
      role: 'ReadOnly',
    },
    {
      account: '890123456789/ALKSLabAdmin - devlabs',
      role: 'LabAdmin',
    },
    { account: '012345678901/ALKSAdmin - prodapps', role: 'Admin' },
    { account: '543210987654/ALKSAdmin - testapps', role: 'Admin' },
    { account: '321098765432/ALKSAdmin - opstools', role: 'Admin' },
    { account: '654321098765/ALKSReadOnly - identity1', role: 'ReadOnly' },
    { account: '876543210987/ALKSReadOnly - identity2', role: 'ReadOnly' },
    { account: '109876543210/ALKSReadOnly - identity3', role: 'ReadOnly' },
  ];

  const mockFavorites = [
    '543210987654/ALKSAdmin - testapps :: Admin',
    '567890123456/ALKSReadOnly - commontools :: ReadOnly',
    '678901234567/ALKSAdmin - clientstaging :: Admin',
    '456789012345/ALKSReadOnly - stagingcell2 :: ReadOnly',
    '111111111111/ALKSReadOnly - testenv2 :: ReadOnly',
    '987654321098/ALKSAdmin - prodbridge1 :: Admin',
    '890123456789/ALKSLabAdmin - devlabs :: LabAdmin',
  ];

  let mockPromptFn: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    (getAlksAccounts as jest.Mock).mockResolvedValue(mockAccounts);
    (getFavorites as jest.Mock).mockResolvedValue(mockFavorites);
    mockPromptFn = jest.fn().mockResolvedValue({
      alksAccount:
        'devlabs ........ 890123456789/ALKSLabAdmin              ::  LabAdmin',
    });
    (getStdErrPrompt as jest.Mock).mockReturnValue(mockPromptFn);
  });

  it('prompts the user with formatted role output', async () => {
    await promptForAlksAccountAndRole({});

    const promptConfig = mockPromptFn.mock.calls[0][0][0];
    const results = await promptConfig.source({}, undefined);
    expect(results).toStrictEqual([
      // favorites pulled to top after alphabetical sort
      'clientstaging .. 678901234567/ALKSAdmin                 ::  Admin',
      'commontools .... 567890123456/ALKSReadOnly              ::  ReadOnly',
      'devlabs ........ 890123456789/ALKSLabAdmin              ::  LabAdmin',
      'prodbridge1 .... 987654321098/ALKSAdmin                 ::  Admin',
      'stagingcell2 ... 456789012345/ALKSReadOnly              ::  ReadOnly',
      'testapps ....... 543210987654/ALKSAdmin                 ::  Admin',
      'testenv2 ....... 111111111111/ALKSReadOnly              ::  ReadOnly',
      'clientmgmt1 .... 345678901234/ALKSReadOnly              ::  ReadOnly',
      'devaccount1 .... 123456789012/ALKSReadOnly              ::  ReadOnly',
      'identity1 ...... 654321098765/ALKSReadOnly              ::  ReadOnly',
      'identity2 ...... 876543210987/ALKSReadOnly              ::  ReadOnly',
      'identity3 ...... 109876543210/ALKSReadOnly              ::  ReadOnly',
      'operations ..... 789012345678/ALKSReadOnlyPlusApproval  ::  ReadOnlyPlusApproval',
      'opstools ....... 321098765432/ALKSAdmin                 ::  Admin',
      'prodapps ....... 012345678901/ALKSAdmin                 ::  Admin',
      'sharedservices . 234567890123/ALKSReadOnly              ::  ReadOnly',
    ]);
  });

  it('returns the ALKS account and role', async () => {
    const result = await promptForAlksAccountAndRole({});
    expect(result).toStrictEqual({
      alksAccount: '890123456789/ALKSLabAdmin - devlabs',
      alksRole: 'LabAdmin',
    });
  });

  it('should filter non-favorites if filterFavorites is true', async () => {
    await promptForAlksAccountAndRole({ filterFavorites: true });
    const promptConfig = mockPromptFn.mock.calls[0][0][0];
    const results = await promptConfig.source({}, undefined);
    expect(results.length).toBe(mockFavorites.length);
  });

  it('should return all choices when input is an empty string', async () => {
    await promptForAlksAccountAndRole({});
    const promptConfig = mockPromptFn.mock.calls[0][0][0];
    const results = await promptConfig.source({}, '');
    expect(results.length).toBe(mockAccounts.length);
  });

  it('should return only matching results when input is provided', async () => {
    await promptForAlksAccountAndRole({});
    const promptConfig = mockPromptFn.mock.calls[0][0][0];
    const results = await promptConfig.source({}, 'devlabs');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r: string) => r.includes('devlabs'))).toBe(true);
  });

  it('should return no results when input does not match any account', async () => {
    await promptForAlksAccountAndRole({});
    const promptConfig = mockPromptFn.mock.calls[0][0][0];
    const results = await promptConfig.source({}, 'rafa');
    expect(results.length).toBe(0);
  });

  it('should throw an error if no accounts are found', async () => {
    (getAlksAccounts as jest.Mock).mockResolvedValue([]);

    await expect(promptForAlksAccountAndRole({})).rejects.toThrow(
      'No accounts found.'
    );
  });

  it('should use default account and role if available', async () => {
    (getAlksAccount as jest.Mock).mockResolvedValue(
      '890123456789/ALKSLabAdmin - devlabs'
    );
    (getAlksRole as jest.Mock).mockResolvedValue('LabAdmin');

    await promptForAlksAccountAndRole({});
    expect(mockPromptFn.mock.calls[0][0][0].default).toBe(
      'devlabs ........ 890123456789/ALKSLabAdmin              ::  LabAdmin'
    );
  });
});
