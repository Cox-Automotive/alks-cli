#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { getSessionKey } from '../lib/getSessionKey';
import { errorAndExit } from '../lib/errorAndExit';
import { log } from '../lib/log';
import { saveMetadata } from '../lib/saveMetadata';
import { trackActivity } from '../lib/tractActivity';
import { tryToExtractRole } from '../lib/tryToExtractRole';
import { getIamKey } from '../lib/getIamKey';

program
  .version(config.version)
  .description('configures the alks metadata server')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-i, --iam', 'create an IAM session')
  .option('-p, --password [password]', 'my password')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const alksAccount = program.account;
let alksRole = program.role;
const forceNewSession = program.newSession;
const filterFaves = program.favorites || false;
const logger = 'server-configure';

if (!_.isUndefined(alksAccount) && _.isUndefined(alksRole)) {
  log(program, logger, 'trying to extract role from account');
  alksRole = tryToExtractRole(alksAccount);
}

(async function () {
  let key;
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

  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    await saveMetadata({
      alksAccount: key.alksAccount,
      alksRole: key.alksRole,
      isIam: key.isIAM,
    });
  } catch (err) {
    return errorAndExit('Unable to save metadata!', err);
  }

  console.error(clc.white('Metadata has been saved!'));

  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
