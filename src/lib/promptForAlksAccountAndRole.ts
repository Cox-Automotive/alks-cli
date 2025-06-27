import { getAlksAccounts } from './getAlksAccounts';
import { getFavorites } from './getFavorites';
import { getStdErrPrompt } from './getStdErrPrompt';
import { log } from './log';
import { getAlksAccount } from './state/alksAccount';
import { getAlksRole } from './state/alksRole';
import { parseAlksAccount } from './parseAlksAccount';
import { formatAccountOutput } from './formatAccountOutput';
import { compareAliasesAlphabetically } from './compareAliasesAlphabetically';
import { compareFavorites } from './compareFavorites';

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

export async function promptForAlksAccountAndRole(
  options: Partial<GetAlksAccountOptions>
): Promise<{ alksAccount: string; alksRole: string }> {
  const opts: GetAlksAccountOptions = {
    iamOnly: options.iamOnly || false,
    prompt: options.prompt || 'Please select an ALKS account/role',
    filterFavorites: options.filterFavorites || false,
  };

  const alksAccounts = (await getAlksAccounts({ iamOnly: opts.iamOnly })).map(
    parseAlksAccount
  );

  const favorites = await getFavorites();
  log(`Favorites: ${favorites.toString()}`);

  const maxAccountAliasLength = Math.max(
    ...alksAccounts.map((a) => a.accountAlias.length)
  );
  const maxAccountIdAndRoleLength = Math.max(
    ...alksAccounts.map((a) => a.accountIdAndRole.length)
  );

  const indexedAlksAccounts = alksAccounts
    .filter(
      (alksAccount) =>
        !opts.filterFavorites || favorites.includes(alksAccount.account)
    ) // Filter out non-favorites if filterFavorites flag is passed
    .sort(compareAliasesAlphabetically()) // Sort alphabetically first
    .sort(compareFavorites(favorites)) // Move favorites to the front of the list, non-favorites to the back
    .map((alksAccount) => ({
      ...alksAccount,
      formattedOutput: formatAccountOutput(
        alksAccount,
        maxAccountAliasLength,
        maxAccountIdAndRoleLength
      ),
    })); // Add a field to the account object containing the formatted output string

  if (!indexedAlksAccounts.length) {
    throw new Error('No accounts found.');
  }

  const promptData: AlksAccountPromptData = {
    type: 'list',
    name: 'alksAccount',
    message: opts.prompt,
    choices: indexedAlksAccounts.map((a) => a.formattedOutput), // Use the formatted output for choices
    pageSize: 15,
  };

  // Ignore failure since we're about to prompt for it
  const defaultAlksAccount = await getAlksAccount();
  const defaultAlksRole = await getAlksRole();

  // If a default account and role are set and they match an account the user has, find the corresponding formatted output string
  if (defaultAlksAccount && defaultAlksRole) {
    const defaultAccount = indexedAlksAccounts.find(
      (account) =>
        account.account === defaultAlksAccount &&
        account.role === defaultAlksRole
    );
    if (defaultAccount) {
      promptData.default = defaultAccount.formattedOutput;
    }
  }

  // ask user which account/role
  const prompt = getStdErrPrompt();
  const answers = await prompt([promptData]);

  const selectedString = answers.alksAccount as string;
  const selectedAccount = indexedAlksAccounts.find(
    (account) => account.formattedOutput === selectedString
  );

  if (!selectedAccount) {
    log(
      `Selected account "${selectedString}" not found in the list of accounts.`
    );
    throw new Error(
      'Account selection failed. The selected account was not found.'
    );
  }

  return {
    alksAccount: selectedAccount.account,
    alksRole: selectedAccount.role,
  };
}
