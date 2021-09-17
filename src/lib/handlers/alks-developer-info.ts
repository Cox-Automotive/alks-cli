import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { trackActivity } from '../trackActivity';
import Table from 'cli-table3';
import { isEmpty } from 'underscore';
import { Developer } from '../../model/developer';
import { getPassword } from '../state/password';
import { getToken } from '../state/token';
import { getDeveloper } from '../state/developer';

export async function handleAlksDeveloperInfo(
  _options: commander.OptionValues
) {
  const table = new Table({
    head: [clc.white.bold('Key'), clc.white.bold('Value')],
    colWidths: [25, 50],
  });

  try {
    log('getting developer');
    const developer = await getDeveloper();

    log('getting password');
    const password = await getPassword();

    log('getting 2fa token');
    const token = await getToken();

    const mapping: Partial<Record<keyof Developer, string>> = {
      server: 'ALKS Server',
      userid: 'Network Login',
      alksAccount: 'Default ALKS Account',
      alksRole: 'Default ALKS Role',
      outputFormat: 'Default Output Format',
    };

    for (const [key, label] of Object.entries(mapping)) {
      const value = developer[key as keyof Developer];
      table.push([label, isEmpty(value) ? '' : value]);
    }

    const tablePassword = !isEmpty(password)
      ? '**********'
      : clc.red('NOT SET');
    table.push(['Password', tablePassword]);

    const tableToken = !isEmpty(token)
      ? (token as string).substring(0, 4) + '**********'
      : clc.red('NOT SET');
    table.push(['2FA Token', tableToken]);

    console.error(clc.white.underline.bold('\nDeveloper Configuration'));
    console.log(clc.white(table.toString()));

    log('checking for update');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
