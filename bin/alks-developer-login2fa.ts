#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import opn from 'opn';
import { getAlks, Props as AlksProps } from '../lib/alks';
import config from '../package.json';
import * as utils from '../lib/utils';
import * as Developer from '../lib/developer';
import { checkForUpdate } from '../lib/checkForUpdate';

program
  .version(config.version)
  .description('stores your alks refresh token')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-login-2fa';

(async function () {
  utils.log(program, logger, 'loading developer');
  const data = await Developer.getDeveloper();

  console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
  const url = data.server.replace(/rest/, 'token-management');
  try {
    await opn(url);
  } catch (err) {
    console.error(`Failed to open ${url}`);
    console.error('Please open the url in the browser of your choice');
  }

  console.error('Please copy your refresh token from ALKS and paste below..');

  const refreshToken = await Developer.getPasswordFromPrompt('Refresh Token');
  utils.log(program, logger, 'exchanging refresh token for access token');

  const alks = await getAlks({
    baseUrl: data.server,
  } as AlksProps);

  try {
    await alks.getAccessToken({
      refreshToken,
    });
  } catch (err) {
    return utils.errorAndExit('Error validating refresh token. ' + err.message);
  }

  console.error(clc.white('Refresh token validated!'));
  try {
    await Developer.storeToken(refreshToken);
    console.error(clc.white('Refresh token saved!'));
  } catch (err) {
    utils.log(program, logger, 'error saving token! ' + err.message);
    utils.passwordSaveErrorHandler(err);
  }

  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);

  setTimeout(() => {
    process.exit(0);
  }, 1000); // needed for if browser is still open
})().catch((err) => utils.errorAndExit(err.message, err));
