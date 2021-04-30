#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import Table from 'cli-table3';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { getAlks } from '../lib/getAlks';
import { errorAndExit } from '../lib/errorAndExit';
import { getAccountRegex } from '../lib/getAccountRegex';
import { getAuth } from '../lib/getAuth';
import { getDeveloper } from '../lib/getDeveloper';
import { isWindows } from '../lib/isWindows';
import { log } from '../lib/log';
import { trackActivity } from '../lib/tractActivity';

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
const accountRegex = getAccountRegex();
const exportCmd = isWindows() ? 'SET' : 'export';
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

  log(program, logger, 'checking for update');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
