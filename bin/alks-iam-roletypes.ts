#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import _ from 'underscore';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import { errorAndExit, log } from '../lib/utils';
import { getAlks } from '../lib/alks';
import { getDeveloper, getAuth, trackActivity } from '../lib/developer';

const logger = 'iam-roletypes';
const outputVals = ['list', 'json'];

program
  .version(config.version)
  .description('list the available iam role types')
  .option(
    '-o, --output [format]',
    'output format (' + outputVals.join(', ') + '), default: ' + outputVals[0],
    outputVals[0]
  )
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const output = program.output;

if (!_.contains(outputVals, output)) {
  errorAndExit(
    'The output provided (' +
      output +
      ') is not in the allowed values: ' +
      outputVals.join(', ')
  );
}

(async function () {
  log(program, logger, 'getting developer');
  const developer = await getDeveloper();

  log(program, logger, 'getting auth');
  const auth = await getAuth(program);

  const alks = await getAlks({
    baseUrl: developer.server,
    ...auth,
  });

  log(program, logger, 'getting list of role types from REST API');
  let roleTypes;
  try {
    roleTypes = await alks.getAllAWSRoleTypes({});
  } catch (err) {
    return errorAndExit(err);
  }

  log(
    program,
    logger,
    'outputting list of ' + (roleTypes ? roleTypes.length : -1) + ' role types'
  );
  console.error(clc.white.underline.bold('\nAvailable IAM Role Types'));

  if (output === 'list') {
    _.each(roleTypes, (roleType, i) => {
      console.log(
        clc.white(
          [i < 9 ? ' ' : '', i + 1, ') ', roleType.roleTypeName].join('')
        )
      );
    });
  } else {
    console.log(
      JSON.stringify(roleTypes.map((roleType) => roleType.roleTypeName))
    );
  }

  log(program, logger, 'checking for updates');
  await checkForUpdate();
  await trackActivity(logger);
})().catch((err) => errorAndExit(err.message, err));
