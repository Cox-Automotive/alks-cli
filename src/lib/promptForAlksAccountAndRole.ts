import { Account } from 'alks.js';
import { getAccountDelim } from './getAccountDelim';
import { getAlksAccounts } from './getAlksAccounts';
import { getFavorites } from './getFavorites';
import { getStdErrPrompt } from './getStdErrPrompt';
import { log } from './log';
import { getAlksAccount } from './state/alksAccount';
import { getAlksRole } from './state/alksRole';

export interface GetAlksAccountOptions {
  iamOnly: boolean;
  prompt: string;
  filterFavorites: boolean;
}

export interface AlksAccountPromptData {
  type: string;
  name: string;
  message: string;
  choices: string[];
  pageSize: number;
  default?: string;
}

const splitAccountStr = (
  account: string
): {
  accountName: string;
  accountId: string;
  accountRole: string;
  accountIdAndRole: string;
} => {
  const [accountIdAndRole, accountName] = account.split(' - ');
  const [accountId, accountRole] = accountIdAndRole.split('/');
  return { accountName, accountId, accountRole, accountIdAndRole };
};

// Output example: AccountName ..... AccountId/AccountRole    :: Role
const formatAccountOutput = (
  account: string,
  role: string,
  maxAccountNameLength: number,
  maxAccountIdAndRoleLength: number
): string => {
  const { accountName, accountIdAndRole } = splitAccountStr(account);
  return [
    `${accountName} .`.padEnd(maxAccountNameLength + 2, '.'),
    accountIdAndRole.padEnd(maxAccountIdAndRoleLength, ' '),
    getAccountDelim(),
    role,
  ].join(' ');
};

const sortFavorites =
  (favorites: string[]) =>
  (a: Account, b: Account): number =>
    Number(favorites.includes(b.account)) -
    Number(favorites.includes(a.account));

const sortAlphabetically =
  () =>
  (a: Account, b: Account): number => {
    const { accountName: aAccountName } = splitAccountStr(a.account);
    const { accountName: bAccountName } = splitAccountStr(b.account);
    return aAccountName.localeCompare(bAccountName);
  };

export async function promptForAlksAccountAndRole(
  options: Partial<GetAlksAccountOptions>
): Promise<{ alksAccount: string; alksRole: string }> {
  const opts: GetAlksAccountOptions = {
    iamOnly: options.iamOnly || false,
    prompt: options.prompt || 'Please select an ALKS account/role',
    filterFavorites: options.filterFavorites || false,
  };

  const alksAccounts = await getAlksAccounts({ iamOnly: opts.iamOnly });

  const favorites = await getFavorites();
  log(`Favorites: ${favorites.toString()}`);

  const [maxAccountNameLength, maxAccountIdAndRoleLength] = alksAccounts.reduce(
    (prev, alksAccount) => {
      const { accountName, accountIdAndRole } = splitAccountStr(
        alksAccount.account
      );
      return [
        Math.max(prev[0], accountName.length),
        Math.max(prev[1], accountIdAndRole.length),
      ];
    },
    [0, 0]
  );

  const indexedAlksAccounts = alksAccounts
    .filter(
      (alksAccount) =>
        !opts.filterFavorites || favorites.includes(alksAccount.account)
    ) // Filter out non-favorites if filterFavorites flag is passed
    .sort(sortAlphabetically()) // Sort alphabetically first
    .sort(sortFavorites(favorites)) // Move favorites to the front of the list, non-favorites to the back
    .map((alksAccount) =>
      formatAccountOutput(
        alksAccount.account,
        alksAccount.role,
        maxAccountNameLength,
        maxAccountIdAndRoleLength
      )
    ); // Convert ALKS account object to ALKS-CLI style account string

  if (!indexedAlksAccounts.length) {
    throw new Error('No accounts found.');
  }

  const promptData: AlksAccountPromptData = {
    type: 'list',
    name: 'alksAccount',
    message: opts.prompt,
    choices: indexedAlksAccounts,
    pageSize: 15,
  };

  // Ignore failure since we're about to prompt for it
  const defaultAlksAccount = await getAlksAccount();
  const defaultAlksRole = await getAlksRole();

  if (defaultAlksAccount && defaultAlksRole) {
    promptData.default = formatAccountOutput(
      defaultAlksAccount,
      defaultAlksRole,
      maxAccountNameLength,
      maxAccountIdAndRoleLength
    );
  }

  // ask user which account/role
  const prompt = getStdErrPrompt();
  const answers = await prompt([promptData]);

  const acctStr = answers.alksAccount as string;
  // rebuild the account string to get the account and role
  const selectedAccountName = acctStr.split(' .')[0];
  const selectedAccountIdAndRole = acctStr.split('. ')[1].split(' ')[0];
  const selectedRole = acctStr.split(getAccountDelim())[1].trim();

  return {
    alksAccount: `${selectedAccountIdAndRole} - ${selectedAccountName}`,
    alksRole: selectedRole,
  };
}
