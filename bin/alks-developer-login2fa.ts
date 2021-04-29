#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import opn from 'opn';
import { getAlks, Props as AlksProps } from '../lib/alks';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { errorAndExit, log, passwordSaveErrorHandler } from '../lib/utils';
import {
  getDeveloper,
  getPasswordFromPrompt,
  storeToken,
  trackActivity,
} from '../lib/developer';

program
  .version(config.version)
  .description('stores your alks refresh token')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-login-2fa';

(async function () {
  log(program, logger, 'loading developer');
  const data = await getDeveloper();

  console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
  const url = data.server.replace(/rest/, 'token-management');
  try {
    await opn(url);
  } catch (err) {
    console.error(`Failed to open ${url}`);
    console.error('Please open the url in the browser of your choice');
  }

  console.error('Please copy your refresh token from ALKS and paste below..');

  const refreshToken = await getPasswordFromPrompt('Refresh Token');
  log(program, logger, 'exchanging refresh token for access token');

  const alks = await getAlks({
    baseUrl: data.server,
  } as AlksProps);

  try {
    await alks.getAccessToken({
      refreshToken,
    });
  } catch (err) {
    return errorAndExit('Error validating refresh token. ' + err.message);
  }

  console.error(clc.white('Refresh token validated!'));
  try {
    await storeToken(refreshToken);
    console.error(clc.white('Refresh token saved!'));
  } catch (err) {
    log(program, logger, 'error saving token! ' + err.message);
    passwordSaveErrorHandler(err);
  }

  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);

  setTimeout(() => {
    process.exit(0);
  }, 1000); // needed for if browser is still open
})().catch((err) => errorAndExit(err.message, err));
