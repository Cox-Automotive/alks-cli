import clc from 'cli-color';
import commander from 'commander';
import { contains } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAccountRegex } from '../getAccountRegex';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { isWindows } from '../isWindows';
import { log } from '../log';
import Table from 'cli-table3';

export async function handleAlksDeveloperAccounts(
  options: commander.OptionValues
) {
  const outputVals = ['table', 'json'];
  const output = options.output;

  if (!contains(outputVals, output)) {
    errorAndExit(
      'The output provided (' +
        output +
        ') is not in the allowed values: ' +
        outputVals.join(', ')
    );
  }
  const fmtStructure = output == 'json'
    ? []
    : (
    new Table({
      head: [
        clc.white.bold('Account'),
        clc.white.bold('Role'),
        clc.white.bold('Type'),
      ],
      colWidths: [50, 50, 25],
    }));

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
    log('getting auth');
    const auth = await getAuth();

    const alks = await getAlks({
      ...auth,
    });

    log('getting alks accounts');
    const alksAccounts = await alks.getAccounts();

    alksAccounts.forEach((alksAccount) => {
      const data = [alksAccount.account, alksAccount.role];

      if (doExport) {
        accountExport(data[0]);
      } else {
        fmtStructure.push(data.concat(alksAccount.iamKeyActive ? 'IAM' : 'Standard'));
      }
    });

    if (!doExport) {
      if (output == 'json') {
        console.log(JSON.stringify(fmtStructure));
      } else {
        console.error(clc.white.underline.bold('\nAvailable Accounts'));
        console.log(clc.white(fmtStructure.toString()));
      }
    }

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
