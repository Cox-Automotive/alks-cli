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

  const indexedAlksAccounts = alksAccounts
    .map((alksAccount) =>
      [alksAccount.account, alksAccount.role].join(getAccountDelim())
    ) // Convert ALKS account object to ALKS-CLI style account string
    .filter(
      (accountString) =>
        !opts.filterFavorites || favorites.includes(accountString)
    ) // Filter out non-favorites if filterFavorites flag is passed
    .sort(
      (a, b) => Number(favorites.includes(b)) - Number(favorites.includes(a))
    ); // Move favorites to the front of the list, non-favorites to the back

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
    promptData.default = [defaultAlksAccount, defaultAlksRole].join(
      getAccountDelim()
    );
  }

  // ask user which account/role
  const prompt = getStdErrPrompt();
  const answers = await prompt([promptData]);

  const acctStr = answers.alksAccount;
  const data = acctStr.split(getAccountDelim());
  const alksAccount = data[0];
  const alksRole = data[1];

  return {
    alksAccount,
    alksRole,
  };
}
