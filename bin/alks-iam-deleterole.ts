#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import * as Alks from '../lib/alks';
import config from '../package.json';
import * as Developer from '../lib/developer';
import * as utils from '../lib/utils';
import { checkForUpdate } from '../lib/checkForUpdate';

const logger = 'iam-delete';

program
  .version(config.version)
  .description('remove an IAM role')
  .option('-n, --rolename [rolename]', 'the name of the role to delete')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const roleName = program.rolename;
let alksAccount = program.account;
let alksRole = program.role;
const filterFavorites = program.favorites || false;

utils.log(program, logger, 'validating role name: ' + roleName);
if (_.isEmpty(roleName)) {
  utils.errorAndExit('The role name must be provided.');
}

if (!_.isUndefined(alksAccount) && _.isUndefined(alksRole)) {
  utils.log(program, logger, 'trying to extract role from account');
  alksRole = utils.tryToExtractRole(alksAccount);
}

(async function () {
  if (_.isEmpty(alksAccount) || _.isEmpty(alksRole)) {
    utils.log(program, logger, 'getting accounts');
    ({ alksAccount, alksRole } = await Developer.getAlksAccount(program, {
      iamOnly: true,
      filterFavorites,
    }));
  } else {
    utils.log(program, logger, 'using provided account/role');
  }

  const developer = await Developer.getDeveloper();

  const auth = await Developer.getAuth(program);

  utils.log(program, logger, 'calling api to delete role: ' + roleName);

  const alks = await Alks.getAlks({
    baseUrl: developer.server,
    ...auth,
  });

  try {
    await alks.deleteRole({
      account: alksAccount,
      role: alksRole,
      roleName,
    });
  } catch (err) {
    return utils.errorAndExit(err);
  }

  console.log(clc.white(['The role ', roleName, ' was deleted'].join('')));
  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
