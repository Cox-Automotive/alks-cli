#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import Table from 'cli-table3';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { errorAndExit } from '../lib/errorAndExit';
import { getDeveloper } from '../lib/getDeveloper';
import { getPassword } from '../lib/getPassword';
import { getToken } from '../lib/getToken';
import { log } from '../lib/log';
import { trackActivity } from '../lib/tractActivity';

program
  .version(config.version)
  .description('shows current developer configuration')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const table = new Table({
  head: [clc.white.bold('Key'), clc.white.bold('Value')],
  colWidths: [25, 50],
});

const logger = 'dev-info';

(async function () {
  log(program, logger, 'getting developer');
  const developer = await getDeveloper();

  log(program, logger, 'getting password');
  const password = await getPassword(null); // null means dont prompt

  log(program, logger, 'getting 2fa token');
  const token = await getToken();

  const ignores = ['lastVersion'];
  const mapping: Record<string, string> = {
    server: 'ALKS Server',
    userid: 'Network Login',
    alksAccount: 'Default ALKS Account',
    alksRole: 'Default ALKS Role',
    outputFormat: 'Default Output Format',
  };

  _.each(developer, (val, key) => {
    if (!_.contains(ignores, key)) {
      table.push([mapping[key], _.isEmpty(val) ? '' : val]);
    }
  });

  const tablePassword = !_.isEmpty(password)
    ? '**********'
    : clc.red('NOT SET');
  table.push(['Password', tablePassword]);

  const tableToken = !_.isEmpty(token)
    ? token.substring(0, 4) + '**********'
    : clc.red('NOT SET');
  table.push(['2FA Token', tableToken]);

  console.error(clc.white.underline.bold('\nDeveloper Configuration'));
  console.log(clc.white(table.toString()));

  log(program, logger, 'checking for update');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
