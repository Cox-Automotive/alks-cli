#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { errorAndExit, log } from '../lib/utils';
import { removeToken, trackActivity } from '../lib/developer';

program
  .version(config.version)
  .description('removes alks refresh token')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-logout2fa';

if (removeToken()) {
  console.error(clc.white('Token removed!'));
} else {
  console.error(clc.red.bold('Error removing token!'));
}

(async function () {
  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
