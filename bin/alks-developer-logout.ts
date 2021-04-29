#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { errorAndExit, log } from '../lib/utils';
import { removePassword, trackActivity } from '../lib/developer';

program
  .version(config.version)
  .description('removes password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-logout';

if (removePassword()) {
  console.error(clc.white('Password removed!'));
} else {
  console.error(clc.red.bold('Error removing password!'));
}

(async function () {
  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
