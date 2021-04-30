#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { errorAndExit } from '../lib/errorAndExit';
import { getPasswordFromPrompt } from '../lib/getPasswordFromPrompt';
import { log } from '../lib/log';
import { passwordSaveErrorHandler } from '../lib/passwordSaveErrorHandler';
import { storePassword } from '../lib/storePassword';
import { trackActivity } from '../lib/tractActivity';

program
  .version(config.version)
  .description('stores password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-login';

(async function () {
  const password = await getPasswordFromPrompt();

  log(program, logger, 'saving password');
  try {
    await storePassword(password);
    console.error(clc.white('Password saved!'));
  } catch (err) {
    log(program, logger, 'error saving password! ' + err.message);
    passwordSaveErrorHandler(err);
  }

  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
