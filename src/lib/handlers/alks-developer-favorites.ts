import ALKS from 'alks.js';
import commander from 'commander';
import inquirer from 'inquirer';
import { contains } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAccountDelim } from '../getAccountDelim';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { getDeveloper } from '../getDeveloper';
import { getFavorites } from '../getFavorites';
import { log } from '../log';
import { saveFavorites } from '../saveFavorites';
import { trackActivity } from '../tractActivity';

export async function handleAlksDeveloperFavorites(
  _options: commander.OptionValues,
  program: commander.Command
) {
  const logger = 'dev-favorites';

  try {
    log(program, logger, 'getting developer');
    const developer = await getDeveloper();

    log(program, logger, 'getting auth');
    const auth = await getAuth(program);

    const alks = await getAlks({
      baseUrl: developer.server,
      ...auth,
    });

    log(program, logger, 'getting alks accounts');
    const alksAccounts = await alks.getAccounts();

    log(program, logger, 'getting favorite accounts');
    const favorites = await getFavorites();

    const choices = [];
    const deferred: ALKS.Account[] = [];

    log(program, logger, 'rendering favorite accounts');
    choices.push(new inquirer.Separator(' = Standard = '));
    alksAccounts.forEach((alksAccount) => {
      if (!alksAccount.iamKeyActive) {
        const name = [alksAccount.account, alksAccount.role].join(
          getAccountDelim()
        );
        choices.push({
          name,
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

    log(program, logger, 'checking for update');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}