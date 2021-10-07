import clc from 'cli-color';
import Table from 'cli-table3';
import moment from 'moment';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { ensureConfigured } from '../ensureConfigured';
import { errorAndExit } from '../errorAndExit';
import { getAuth } from '../getAuth';
import { obfuscate } from '../obfuscate';
import { getKeys } from '../getKeys';
import { each, groupBy } from 'underscore';
import { log } from '../log';

export async function handleAlksSessionsList(_options: commander.OptionValues) {
  try {
    await ensureConfigured();

    log('getting auth');
    const auth = await getAuth();

    log('getting existing sesions');
    const nonIamKeys = await getKeys(auth, false);

    log('getting existing iam sesions');
    const iamKeys = await getKeys(auth, true);

    const foundKeys = [...nonIamKeys, ...iamKeys];

    const table = new Table({
      head: [
        clc.white.bold('Access Key'),
        clc.white.bold('Secret Key'),
        clc.white.bold('Type'),
        clc.white.bold('Expires'),
        clc.white.bold('Created'),
      ],
      colWidths: [25, 25, 10, 25, 25],
    });

    const groupedKeys = groupBy(foundKeys, 'alksAccount');

    each(groupedKeys, (keys, alksAccount) => {
      table.push([
        {
          colSpan: 4,
          content: clc.yellow.bold('ALKS Account: ' + alksAccount),
        },
      ]);

      each(keys, (keydata) => {
        table.push([
          obfuscate(keydata.accessKey),
          obfuscate(keydata.secretKey),
          keydata.isIAM ? 'IAM' : 'Standard',
          moment(keydata.expires).calendar(),
          moment(keydata.meta.created).fromNow(),
        ]);
      });
    });

    if (!foundKeys.length) {
      table.push([
        { colSpan: 5, content: clc.yellow.bold('No active sessions found.') },
      ]);
    }

    console.error(clc.white.underline.bold('Active Sessions'));
    console.log(clc.white(table.toString()));

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
