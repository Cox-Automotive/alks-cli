#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import clc from 'cli-color';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { errorAndExit, log, tryToExtractRole } from '../lib/utils';
import { getAlks } from '../lib/alks';
import { trackActivity } from '../lib/developer';
import { getIAMAccount } from '../lib/iam';

const logger = 'iam-createltk';
const nameDesc = 'alphanumeric including @+=._-';

program
  .version(config.version)
  .description('creates a new IAM Longterm Key')
  .option(
    '-n, --iamusername [iamUsername]',
    'the name of the iam user associated with the LTK, ' + nameDesc
  )
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-o, --output [format]', 'output format (text, json)', 'text')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
const iamUsername = program.iamusername;
let alksAccount: string | undefined = program.account;
let alksRole: string | undefined = program.role;
const filterFaves = program.favorites || false;
const output = program.output || 'text';

log(program, logger, 'validating iam user name: ' + iamUsername);
if (_.isEmpty(iamUsername)) {
  errorAndExit('Please provide a username (-n)');
} else if (!NAME_REGEX.test(iamUsername)) {
  errorAndExit(
    'The username provided contains illegal characters. It must be ' + nameDesc
  );
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

  log(program, logger, 'calling api to create ltk: ' + iamUsername);

  if (!alksAccount || !alksRole) {
    throw new Error('Must specifify ALKS Account and Role');
  }
  const ltk = await alks.createAccessKeys({
    account: alksAccount,
    role: alksRole,
    iamUserName: iamUsername,
  });

  if (output === 'json') {
    const ltkData = {
      accessKey: ltk.accessKey,
      secretKey: ltk.secretKey,
      iamUserName: iamUsername,
      iamUserArn: ltk.iamUserArn,
    };
    console.log(JSON.stringify(ltkData, null, 4));
  } else {
    const ltkData = {
      accessKey: ltk.accessKey,
      secretKey: ltk.secretKey,
      iamUserName: iamUsername,
      iamUserArn: ltk.iamUserArn,
      alksAccount,
      alksRole,
    };
    console.log(
      clc.white(
        [
          'LTK created for IAM User: ',
          iamUsername,
          ' was created with the ARN: ',
        ].join('')
      ) + clc.white.underline(ltkData.iamUserArn)
    );
    console.log(
      clc.white(['LTK Access Key: '].join('')) +
        clc.white.underline(ltkData.accessKey)
    );
    console.log(
      clc.white(['LTK Secret Key: '].join('')) +
        clc.white.underline(ltkData.secretKey)
    );
  }

  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
