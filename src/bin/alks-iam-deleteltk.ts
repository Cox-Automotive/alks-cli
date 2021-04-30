#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import clc from 'cli-color';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { getAlks } from '../lib/getAlks';
import { errorAndExit } from '../lib/errorAndExit';
import { getIAMAccount } from '../lib/getIamAccount';
import { log } from '../lib/log';
import { trackActivity } from '../lib/tractActivity';
import { tryToExtractRole } from '../lib/tryToExtractRole';

const logger = 'iam-deleteltk';

program
  .version(config.version)
  .description('deletes an IAM Longterm Key')
  .option(
    '-n, --iamusername [iamUsername]',
    'the name of the iam user associated with the LTK'
  )
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const iamUsername = program.iamusername;
let alksAccount = program.account;
let alksRole = program.role;
const filterFaves = program.favorites || false;

log(program, logger, 'validating iam user name: ' + iamUsername);
if (_.isEmpty(iamUsername)) {
  errorAndExit('The IAM username is required.');
}

if (!_.isUndefined(alksAccount) && _.isUndefined(alksRole)) {
  log(program, logger, 'trying to extract role from account');
  alksRole = tryToExtractRole(alksAccount);
}

(async function () {
  let iamAccount;
  try {
    iamAccount = await getIAMAccount(
      program,
      logger,
      alksAccount,
      alksRole,
      filterFaves
    );
  } catch (err) {
    return errorAndExit(err);
  }
  const { developer, auth } = iamAccount;
  ({ account: alksAccount, role: alksRole } = iamAccount);

  const alks = await getAlks({
    baseUrl: developer.server,
    ...auth,
  });

  log(program, logger, 'calling api to delete ltk: ' + iamUsername);

  try {
    await alks.deleteIAMUser({
      account: alksAccount,
      role: alksRole,
      iamUserName: iamUsername,
    });
  } catch (err) {
    return errorAndExit(err);
  }

  console.log(clc.white(['LTK deleted for IAM User: ', iamUsername].join('')));

  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
