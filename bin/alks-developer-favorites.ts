#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import * as Alks from '../lib/alks';
import inquirer from 'inquirer';
import config from '../package.json';
import * as Developer from '../lib/developer';
import * as utils from '../lib/utils';
import { checkForUpdate } from '../lib/checkForUpdate';

program
  .version(config.version)
  .description('configure which accounts are favorites')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-favorites';

(async function () {
  utils.log(program, logger, 'getting developer');
  const developer = await Developer.getDeveloper();

  utils.log(program, logger, 'getting auth');
  const auth = await Developer.getAuth(program);

  const alks = await Alks.getAlks({
    baseUrl: developer.server,
    userid: developer.userid,
    password: auth.password,
    token: auth.token,
  });

  utils.log(program, logger, 'getting alks accounts');
  const alksAccounts = await alks.getAccounts();

  utils.log(program, logger, 'getting favorite accounts');
  const favorites = await Developer.getFavorites();

  const choices = [];
  const deferred: any[] = [];

  utils.log(program, logger, 'rendering favorite accounts');
  choices.push(new inquirer.Separator(' = Standard = '));
  alksAccounts.forEach((alksAccount) => {
    if (!alksAccount.iamKeyActive) {
      const name = [alksAccount.account, alksAccount.role].join(
        Developer.getAccountDelim()
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
    const name = [val.account, val.role].join(Developer.getAccountDelim());
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

  await Developer.saveFavorites({ accounts: faves });
  console.log('Favorites have been saved!');

  utils.log(program, logger, 'checking for update');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
