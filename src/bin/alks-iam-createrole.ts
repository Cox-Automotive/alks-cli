#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import clc from 'cli-color';
import config from '../../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { getAlks } from '../lib/getAlks';
import { errorAndExit } from '../lib/errorAndExit';
import { getAlksAccount } from '../lib/getAlksAccount';
import { getAuth } from '../lib/getAuth';
import { getDeveloper } from '../lib/getDeveloper';
import { log } from '../lib/log';
import { trackActivity } from '../lib/tractActivity';
import { tryToExtractRole } from '../lib/tryToExtractRole';

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

const options = program.opts();
const ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
const roleName = options.rolename;
const roleType = options.roletype;
const incDefPolicies = options.defaultPolicies;
const enableAlksAccess = options.enableAlksAccess;
let alksAccount = options.account;
let alksRole = options.role;
const filterFavorites = options.favorites || false;

log(program, logger, 'validating role name: ' + roleName);
if (_.isEmpty(roleName) || !ROLE_NAME_REGEX.test(roleName)) {
  errorAndExit(
    'The role name provided contains illegal characters. It must be ' +
      roleNameDesc
  );
}

log(program, logger, 'validating role type: ' + roleType);
if (_.isEmpty(roleType)) {
  errorAndExit('The role type is required');
}

if (!_.isUndefined(alksAccount) && _.isUndefined(alksRole)) {
  log(program, logger, 'trying to extract role from account');
  alksRole = tryToExtractRole(alksAccount);
}

(async function () {
  if (_.isEmpty(alksAccount) || _.isEmpty(alksRole)) {
    log(program, logger, 'getting accounts');
    ({ alksAccount, alksRole } = await getAlksAccount(program, {
      iamOnly: true,
      filterFavorites,
    }));
  } else {
    log(program, logger, 'using provided account/role');
  }

  const developer = await getDeveloper();

  const auth = await getAuth(program);

  log(program, logger, 'calling api to create role: ' + roleName);

  const alks = await getAlks({
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
    return errorAndExit(err);
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
  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
