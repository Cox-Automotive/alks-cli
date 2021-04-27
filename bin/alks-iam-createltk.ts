#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

import program from 'commander';
import _ from 'underscore';
import clc from 'cli-color';
import * as Alks from '../lib/alks';
import * as Iam from '../lib/iam';
import * as utils from '../lib/utils';
import * as Developer from '../lib/developer';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';

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
let alksAccount = program.account;
let alksRole = program.role;
const filterFaves = program.favorites || false;
const output = program.output || 'text';

utils.log(program, logger, 'validating iam user name: ' + iamUsername);
if (_.isEmpty(iamUsername)) {
  utils.errorAndExit('Please provide a username (-n)');
} else if (!NAME_REGEX.test(iamUsername)) {
  utils.errorAndExit(
    'The username provided contains illegal characters. It must be ' + nameDesc
  );
}

if (!_.isUndefined(alksAccount) && _.isUndefined(alksRole)) {
  utils.log(program, logger, 'trying to extract role from account');
  alksRole = utils.tryToExtractRole(alksAccount);
}

(async function () {
  let iamAccount;
  try {
    iamAccount = await Iam.getIAMAccount(
      program,
      logger,
      alksAccount,
      alksRole,
      filterFaves
    );
  } catch (err) {
    return utils.errorAndExit(err);
  }
  const { developer, auth } = iamAccount;
  ({ account: alksAccount, role: alksRole } = iamAccount);

  const alks = await Alks.getAlks({
    baseUrl: developer.server,
    userid: developer.userid,
    password: auth.password,
    token: auth.token,
  });

  utils.log(program, logger, 'calling api to create ltk: ' + iamUsername);

  let ltk;
  try {
    ltk = await alks.createAccessKeys({
      account: alksAccount,
      role: alksRole,
      iamUserName: iamUsername,
    });
  } catch (err) {
    return utils.errorAndExit(err);
  }
  const ltkData: any = {
    accessKey: ltk.accessKey,
    secretKey: ltk.secretKey,
    iamUserName: iamUsername,
    iamUserArn: ltk.iamUserArn,
    alksAccount,
    alksRole,
  };

  if (output === 'json') {
    _.each(['alksAccount', 'alksRole'], (key) => {
      delete ltkData[key];
    });
    console.log(JSON.stringify(ltkData, null, 4));
  } else {
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

  utils.log(program, logger, 'checking for updates');
  await checkForUpdate();
  await Developer.trackActivity(logger);
})().catch((err) => utils.errorAndExit(err.message, err));
