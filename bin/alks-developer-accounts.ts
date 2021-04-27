#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import Table from 'cli-table3';
import * as Alks from '../lib/alks';
import config from '../package.json';
import * as Developer from '../lib/developer';
import * as utils from '../lib/utils';
import { checkForUpdate } from '../lib/checkForUpdate';

program
  .version(config.version)
  .description('shows current developer configuration')
  .option('-v, --verbose', 'be verbose')
  .option('-e, --export', 'export accounts to environment variables')
  .parse(process.argv);

const table = new Table({
  head: [
    clc.white.bold('Account'),
    clc.white.bold('Role'),
    clc.white.bold('Type'),
  ],
  colWidths: [50, 50, 25],
});

const logger = 'dev-accounts';
const doExport = program.export;
const accountRegex = utils.getAccountRegex();
const exportCmd = utils.isWindows() ? 'SET' : 'export';
const accounts: string[] = [];

function getUniqueAccountName(accountName: string) {
  let i = 1;
  let test = accountName;

  while (_.contains(accounts, test)) {
    test = accountName + i++;
  }

  return test;
}

function accountExport(account: string) {
  let match: RegExpExecArray | null;
  while ((match = accountRegex.exec(account))) {
    if (match && account.indexOf('ALKS_') === -1) {
      // ignore legacy accounts
      const accountName = getUniqueAccountName(
        [match[6].toLowerCase(), match[4].toLowerCase()].join('_')
      );
      accounts.push(accountName);
      console.log(exportCmd + ' ' + accountName + '="' + account + '"');
    }
  }
}

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

  alksAccounts.forEach((alksAccount) => {
    const data = [alksAccount.account, alksAccount.role];

    if (doExport) {
      accountExport(data[0]);
    } else {
      table.push(data.concat(alksAccount.iamKeyActive ? 'IAM' : 'Standard'));
    }
  });

  if (!doExport) {
    console.error(clc.white.underline.bold('\nAvailable Accounts'));
    console.log(clc.white(table.toString()));
  }

  utils.log(program, logger, 'checking for update');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
