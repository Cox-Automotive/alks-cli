#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import clc from 'cli-color';
import ALKS from 'alks.js';
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

const logger = 'iam-createtrustrole';
const roleNameDesc = 'alphanumeric including @+=._-';
const trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';

program
  .version(config.version)
  .description('creates a new IAM Trust role')
  .option('-n, --rolename [rolename]', 'the name of the role, ' + roleNameDesc)
  .option(
    '-t, --roletype [roletype]',
    'the role type: Cross Account or Inner Account'
  )
  .option('-T, --trustarn [trustarn]', 'trust arn, ' + trustArnDesc)
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
const TRUST_ARN_REGEX = /arn:(aws|aws-us-gov):iam::\d{12}:role\/?[a-zA-Z_0-9+=,.@-_/]+/g;
const roleName = program.rolename;
const roleType = program.roletype;
const trustArn = program.trustarn;
const enableAlksAccess = program.enableAlksAccess;
let alksAccount = program.account;
let alksRole = program.role;
const filterFavorites = program.favorites || false;

log(program, logger, 'validating role name: ' + roleName);
if (_.isEmpty(roleName) || !ROLE_NAME_REGEX.test(roleName)) {
  errorAndExit(
    'The role name provided contains illegal characters. It must be ' +
      roleNameDesc
  );
}

log(program, logger, 'validating role type: ' + roleType);
if (
  _.isEmpty(roleType) ||
  (roleType !== 'Cross Account' && roleType !== 'Inner Account')
) {
  errorAndExit('The role type is required');
}

log(program, logger, 'validating trust arn: ' + trustArn);
if (_.isEmpty(trustArn) || !TRUST_ARN_REGEX.test(trustArn)) {
  errorAndExit(
    'The trust arn provided contains illegal characters. It must be ' +
      trustArnDesc
  );
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

  log(program, logger, 'calling api to create trust role: ' + roleName);

  const alks = await getAlks({
    baseUrl: developer.server,
    ...auth,
  });

  let role;
  try {
    role = await alks.createNonServiceRole({
      account: alksAccount,
      role: alksRole,
      roleName,
      roleType,
      trustArn,
      enableAlksAccess,
      includeDefaultPolicy: ALKS.PseudoBoolean.False,
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
