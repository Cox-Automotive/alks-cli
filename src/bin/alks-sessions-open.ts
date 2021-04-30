#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { getSessionKey } from '../lib/getSessionKey';
import { getIamKey } from '../lib/getIamKey';
import { errorAndExit } from '../lib/errorAndExit';
import { getDeveloper } from '../lib/getDeveloper';
import { getKeyOutput } from '../lib/getKeyOutput';
import { getOutputValues } from '../lib/getOutputValues';
import { log } from '../lib/log';
import { trackActivity } from '../lib/tractActivity';
import { tryToExtractRole } from '../lib/tryToExtractRole';

const outputValues = getOutputValues();

program
  .version(config.version)
  .description('creates or resumes a session')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-i, --iam', 'create an IAM session')
  .option('-p, --password [password]', 'my password')
  .option(
    '-o, --output [format]',
    'output format (' + outputValues.join(', ') + ')'
  )
  .option(
    '-n, --namedProfile [profile]',
    'if output is set to creds, use this profile, default: default'
  )
  .option(
    '-f, --force',
    'if output is set to creds, force overwriting of AWS credentials'
  )
  .option('-F, --favorites', 'filters favorite accounts')
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
const output = program.output;
const filterFaves = program.favorites || false;
const logger = 'sessions-open';

if (!_.isUndefined(alksAccount) && _.isUndefined(alksRole)) {
  log(program, logger, 'trying to extract role from account');
  alksRole = tryToExtractRole(alksAccount);
}

(async function () {
  let developer;
  try {
    developer = await getDeveloper();
  } catch (err) {
    return errorAndExit('Unable to load default account!', err);
  }

  if (useDefaultAcct) {
    alksAccount = developer.alksAccount;
    alksRole = developer.alksRole;
  }

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

  console.log(
    getKeyOutput(
      output || developer.outputFormat,
      key,
      program.namedProfile,
      program.force
    )
  );

  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
