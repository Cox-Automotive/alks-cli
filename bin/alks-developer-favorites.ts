#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import inquirer from 'inquirer';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import ALKS from 'alks.js';
import { errorAndExit, log } from '../lib/utils';
import { getAlks } from '../lib/alks';
import {
  getDeveloper,
  getAuth,
  getFavorites,
  getAccountDelim,
  saveFavorites,
  trackActivity,
} from '../lib/developer';

program
  .version(config.version)
  .description('configure which accounts are favorites')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-favorites';

(async function () {
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
        checked: _.contains(favorites, name),
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
      checked: _.contains(favorites, name),
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
})().catch((err) => errorAndExit(err.message, err));
