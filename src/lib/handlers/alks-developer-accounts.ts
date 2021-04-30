import clc from 'cli-color';
import commander from 'commander';
import { contains } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAccountRegex } from '../getAccountRegex';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { getDeveloper } from '../getDeveloper';
import { isWindows } from '../isWindows';
import { log } from '../log';
import { trackActivity } from '../tractActivity';
import Table from 'cli-table3';

export async function handleAlksDeveloperAccounts(program: commander.Command) {
  const options = program.opts();

  const table = new Table({
    head: [
      clc.white.bold('Account'),
      clc.white.bold('Role'),
      clc.white.bold('Type'),
    ],
    colWidths: [50, 50, 25],
  });

  const logger = 'dev-accounts';
  const doExport = options.export;
  const accountRegex = getAccountRegex();
  const exportCmd = isWindows() ? 'SET' : 'export';
  const accounts: string[] = [];

  function getUniqueAccountName(accountName: string) {
    let i = 1;
    let test = accountName;

    while (contains(accounts, test)) {
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
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
