#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import clc from 'cli-color';
import * as Alks from '../lib/alks';
import * as utils from '../lib/utils';
import * as Developer from '../lib/developer';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';

const logger = 'iam-createrole';
const roleNameDesc = 'alphanumeric including @+=._-';

program
  .version(config.version)
  .description('creates a new IAM role')
  .option('-n, --rolename [rolename]', 'the name of the role, ' + roleNameDesc)
  .option(
    '-t, --roletype [roletype]',
    'the role type, to see available roles: alks iam roletypes'
  )
  .option(
    '-d, --defaultPolicies',
    'include default policies, default: false',
    false
  )
  .option(
    '-e, --enableAlksAccess',
    'enable alks access (MI), default: false',
    false
  )
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
const roleName = program.rolename;
const roleType = program.roletype;
const incDefPolicies = program.defaultPolicies;
const enableAlksAccess = program.enableAlksAccess;
let alksAccount = program.account;
let alksRole = program.role;
const filterFavorites = program.favorites || false;

utils.log(program, logger, 'validating role name: ' + roleName);
if (_.isEmpty(roleName) || !ROLE_NAME_REGEX.test(roleName)) {
  utils.errorAndExit(
    'The role name provided contains illegal characters. It must be ' +
      roleNameDesc
  );
}

utils.log(program, logger, 'validating role type: ' + roleType);
if (_.isEmpty(roleType)) {
  utils.errorAndExit('The role type is required');
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

  utils.log(program, logger, 'calling api to create role: ' + roleName);

  const alks = await Alks.getAlks({
    baseUrl: developer.server,
    ...auth,
  });

  let role;
  try {
    role = await alks.createRole({
      account: alksAccount,
      role: alksRole,
      roleName,
      roleType,
      includeDefaultPolicy: incDefPolicies,
      enableAlksAccess,
    });
  } catch (err) {
    return utils.errorAndExit(err);
  }

  console.log(
    clc.white(
      ['The role: ', roleName, ' was created with the ARN: '].join('')
    ) + clc.white.underline(role.roleArn)
  );
  if (role.instanceProfileArn) {
    console.log(
      clc.white(
        ['An instance profile was also created with the ARN: '].join('')
      ) + clc.white.underline(role.instanceProfileArn)
    );
  }
  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
