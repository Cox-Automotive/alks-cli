import ALKS from 'alks.js';
import commander from 'commander';
import inquirer from 'inquirer';
import { contains } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAccountDelim } from '../getAccountDelim';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { getFavorites } from '../getFavorites';
import { log } from '../log';
import { saveFavorites } from '../saveFavorites';

export async function handleAlksDeveloperFavorites(
  _options: commander.OptionValues
) {
  try {
    log('getting auth');
    const auth = await getAuth();

    const alks = await getAlks({
      ...auth,
    });

    log('getting alks accounts');
    const alksAccounts = await alks.getAccounts();

    log('getting favorite accounts');
    const favorites = await getFavorites();

    const choices = [];
    const deferred: ALKS.Account[] = [];

    log('rendering favorite accounts');
    choices.push(new inquirer.Separator(' = Standard = '));
    alksAccounts.forEach((alksAccount) => {
      if (!alksAccount.iamKeyActive) {
        const name = [alksAccount.account, alksAccount.role].join(
          getAccountDelim()
        );
        choices.push({
          name,
          value: name,
          checked: contains(favorites, name),
        });
      } else {
        deferred.push(alksAccount);
      }
    });

    choices.push(new inquirer.Separator(' = IAM = '));
    deferred.forEach((val) => {
      const name = [val.account, val.role].join(getAccountDelim());
      choices.push({
        name,
        value: name,
        checked: contains(favorites, name),
      });
    });

    const faves = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select favorites',
        name: 'favorites',
        choices,
        pageSize: 25,
      },
    ]);

    await saveFavorites({ accounts: faves });
    console.log('Favorites have been saved!');

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
