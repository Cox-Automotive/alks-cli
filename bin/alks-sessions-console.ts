#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import opn from 'opn';
import alksNode from 'alks-node';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { Key } from '../lib/keys';
import { log, tryToExtractRole, errorAndExit, getUA } from '../lib/utils';
import { getDeveloper, trackActivity } from '../lib/developer';
import { getSessionKey } from '../lib/sessions';
import { getIAMKey } from '../lib/iam';

program
  .version(config.version)
  .description('open an AWS console in your browser')
  .option('-u, --url', 'just print the url')
  .option('-o, --openWith [appName]', 'open in a different app (optional)')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-i, --iam', 'create an IAM session')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-p, --password [password]', 'my password')
  .option('-N, --newSession', 'forces a new session to be generated')
  .option(
    '-d, --default',
    'uses your default account from "alks developer configure"'
  )
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

let alksAccount = program.account;
let alksRole = program.role;
const forceNewSession = program.newSession;
const useDefaultAcct = program.default;
const filterFaves = program.favorites || false;
const logger = 'sessions-console';

if (!_.isUndefined(alksAccount) && _.isUndefined(alksRole)) {
  log(program, logger, 'trying to extract role from account');
  alksRole = tryToExtractRole(alksAccount);
}

(async function () {
  if (useDefaultAcct) {
    try {
      const dev = await getDeveloper();

      alksAccount = dev.alksAccount;
      alksRole = dev.alksRole;
    } catch (err) {
      return errorAndExit('Unable to load default account!', err);
    }
  }

  let key: Key;
  try {
    if (_.isUndefined(program.iam)) {
      key = await getSessionKey(
        program,
        logger,
        alksAccount,
        alksRole,
        false,
        forceNewSession,
        filterFaves
      );
    } else {
      key = await getIAMKey(
        program,
        logger,
        alksAccount,
        alksRole,
        forceNewSession,
        filterFaves
      );
    }
  } catch (err) {
    return errorAndExit(err);
  }

  log(program, logger, 'calling aws to generate 15min console URL');

  const url = await new Promise((resolve) => {
    alksNode.generateConsoleUrl(
      key,
      { debug: program.verbose, ua: getUA() },
      (err: Error, consoleUrl: string) => {
        if (err) {
          errorAndExit(err.message, err);
        } else {
          resolve(consoleUrl);
        }
      }
    );
  });

  if (program.url) {
    console.log(url);
  } else {
    const opts = !_.isEmpty(program.openWith) ? { app: program.openWith } : {};
    try {
      await opn(url, opts);
    } catch (err) {
      console.error(`Failed to open ${url}`);
      console.error('Please open the url in the browser of your choice');
    }

    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // needed for if browser is still open
    process.exit(0);
  }
})().catch((err) => errorAndExit(err.message, err));
