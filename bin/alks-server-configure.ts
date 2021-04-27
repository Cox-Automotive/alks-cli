#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import config from '../package.json';
import * as utils from '../lib/utils';
import * as Developer from '../lib/developer';
import * as Sessions from '../lib/sessions';
import * as Iam from '../lib/iam';
import { checkForUpdate } from '../lib/checkForUpdate';

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
  utils.log(program, logger, 'trying to extract role from account');
  alksRole = utils.tryToExtractRole(alksAccount);
}

(async function () {
  let key;
  try {
    if (_.isUndefined(program.iam)) {
      key = await Sessions.getSessionKey(
        program,
        logger,
        alksAccount,
        alksRole,
        false,
        forceNewSession,
        filterFaves
      );
    } else {
      key = await Iam.getIAMKey(
        program,
        logger,
        alksAccount,
        alksRole,
        forceNewSession,
        filterFaves
      );
    }
  } catch (err) {
    return utils.errorAndExit(err);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    await Developer.saveMetadata({
      alksAccount: key.alksAccount,
      alksRole: key.alksRole,
      isIam: key.isIAM,
    });
  } catch (err) {
    return utils.errorAndExit('Unable to save metadata!', err);
  }

  console.error(clc.white('Metadata has been saved!'));

  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
