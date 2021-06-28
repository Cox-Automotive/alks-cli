import { getAccountDelim } from './getAccountDelim';
import { getAlks } from './getAlks';
import { getAuth } from './getAuth';
import { getFavorites } from './getFavorites';
import { getStdErrPrompt } from './getStdErrPrompt';
import { log } from './log';
import { getAlksAccount } from './state/alksAccount';
import { getAlksRole } from './state/alksRole';

export interface GetAlksAccountProps {
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
  options: Partial<GetAlksAccountProps>
): Promise<{ alksAccount: string; alksRole: string }> {
  log('retreiving alks account');

  const opts: GetAlksAccountProps = {
    iamOnly: options.iamOnly || false,
    prompt: options.prompt || 'Please select an ALKS account/role',
    filterFavorites: options.filterFavorites || false,
  };

  const auth = await getAuth();

  // load available account/roles
  const alks = await getAlks({
    ...auth,
  });

  const alksAccounts = await alks.getAccounts();
  log(
    `All accounts: ${alksAccounts.map((alksAccount) => alksAccount.account)}`
  );

  const favorites = await getFavorites();
  log(`Favorites: ${favorites.toString()}`);

  const indexedAlksAccounts = alksAccounts
    .filter((alksAccount) => !opts.iamOnly || alksAccount.iamKeyActive) // Filter out non-iam-active accounts if iamOnly flag is passed
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
  const defaultAlksAccount = await getAlksAccount().catch(() => undefined);
  const defaultAlksRole = await getAlksRole().catch(() => undefined);

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
