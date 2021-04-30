#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import opn from 'opn';
import alksNode from 'alks-node';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { Key } from '../model/keys';
import { getSessionKey } from '../lib/getSessionKey';
import { errorAndExit } from '../lib/errorAndExit';
import { getDeveloper } from '../lib/getDeveloper';
import { log } from '../lib/log';
import { trackActivity } from '../lib/tractActivity';
import { tryToExtractRole } from '../lib/tryToExtractRole';
import { getIamKey } from '../lib/getIamKey';
import { getUserAgentString } from '../lib/getUserAgentString';

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

const options = program.opts();
let alksAccount = options.account;
let alksRole = options.role;
const forceNewSession = options.newSession;
const useDefaultAcct = options.default;
const filterFaves = options.favorites || false;
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
    if (_.isUndefined(options.iam)) {
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
      key = await getIamKey(
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
      { debug: options.verbose, ua: getUserAgentString() },
      (err: Error, consoleUrl: string) => {
        if (err) {
          errorAndExit(err.message, err);
        } else {
          resolve(consoleUrl);
        }
      }
    );
  });

  if (options.url) {
    console.log(url);
  } else {
    const opts = !_.isEmpty(options.openWith) ? { app: options.openWith } : {};
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
