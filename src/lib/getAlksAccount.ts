import commander from 'commander';
import { Developer } from '../model/developer';
import { getAccountDelim } from './getAccountDelim';
import { getAlks } from './getAlks';
import { getAuth } from './getAuth';
import { getDeveloper } from './getDeveloper';
import { getFavorites } from './getFavorites';
import { getStdErrPrompt } from './getStdErrPrompt';
import { log } from './log';

export interface GetAlksAccountProps {
  iamOnly: boolean;
  prompt: string;
  server?: string;
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

export async function getAlksAccount(
  program: commander.Command,
  options: Partial<GetAlksAccountProps>
): Promise<{ alksAccount: string; alksRole: string }> {
  log('retreiving alks account');

  let developer: Developer | undefined;
  try {
    developer = await getDeveloper();
  } catch (e) {
    // It's ok if developer isn't set yet since this may be called during the initial setup
  }

  const opts: GetAlksAccountProps = {
    iamOnly: options.iamOnly || false,
    prompt: options.prompt || 'Please select an ALKS account/role',
    filterFavorites: options.filterFavorites || false,
    server: options.server || developer?.server,
  };

  if (!opts.server) {
    throw new Error('No server URL configured');
  }

  const auth = await getAuth(program);

  // load available account/roles
  const alks = await getAlks({
    baseUrl: opts.server,
    ...auth,
  });

  const alksAccounts = await alks.getAccounts();

  const favorites = await getFavorites();

  const indexedAlksAccounts = alksAccounts
    .filter((alksAccount) => !opts.iamOnly || alksAccount.iamKeyActive) // Filter out non-iam-active accounts if iamOnly flag is passed
    .filter(
      (alksAccount) =>
        !opts.filterFavorites || favorites.includes(alksAccount.account)
    ) // Filter out non-favorites if filterFavorites flag is passed
    .sort(
      (a, b) =>
        Number(favorites.includes(b.account)) -
        Number(favorites.includes(a.account))
    ) // Move favorites to the front of the list, non-favorites to the back
    .map((alksAccount) =>
      [alksAccount.account, alksAccount.role].join(getAccountDelim())
    );

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

  if (developer) {
    promptData.default = [developer.alksAccount, developer.alksRole].join(
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
