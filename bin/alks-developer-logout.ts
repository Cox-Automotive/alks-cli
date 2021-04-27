#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import config from '../package.json';
import * as utils from '../lib/utils';
import * as Developer from '../lib/developer';
import { checkForUpdate } from '../lib/checkForUpdate';

program
  .version(config.version)
  .description('removes password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-logout';

if (Developer.removePassword()) {
  console.error(clc.white('Password removed!'));
} else {
  console.error(clc.red.bold('Error removing password!'));
}

(async function () {
  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
