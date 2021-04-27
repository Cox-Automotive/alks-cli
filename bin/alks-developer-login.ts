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
  .description('stores password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-login';

(async function () {
  const password = await Developer.getPasswordFromPrompt();

  utils.log(program, logger, 'saving password');
  try {
    await Developer.storePassword(password);
    console.error(clc.white('Password saved!'));
  } catch (err) {
    utils.log(program, logger, 'error saving password! ' + err.message);
    utils.passwordSaveErrorHandler(err);
  }

  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
