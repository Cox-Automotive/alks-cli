#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import Table from 'cli-table3';
import moment from 'moment';
import config from '../package.json';
import * as utils from '../lib/utils';
import * as Developer from '../lib/developer';
import * as keys from '../lib/keys';
import { checkForUpdate } from '../lib/checkForUpdate';

program
  .version(config.version)
  .description('list active sessions')
  .option('-p, --password [password]', 'my password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'sessions-list';

(async function () {
  await Developer.ensureConfigured();

  utils.log(program, logger, 'getting auth');
  const auth = await Developer.getAuth(program);

  utils.log(program, logger, 'getting existing sesions');
  const nonIamKeys = await keys.getKeys(auth, false);

  utils.log(program, logger, 'getting existing iam sesions');
  const iamKeys = await keys.getKeys(auth, true);

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

  const groupedKeys = _.groupBy(foundKeys, 'alksAccount');

  _.each(groupedKeys, (keys, alksAccount) => {
    table.push([
      { colSpan: 4, content: clc.yellow.bold('ALKS Account: ' + alksAccount) },
    ]);

    _.each(keys, (keydata) => {
      console.log(JSON.stringify(keydata, null, 2));
      table.push([
        utils.obfuscate(keydata.accessKey),
        utils.obfuscate(keydata.secretKey),
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

  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
