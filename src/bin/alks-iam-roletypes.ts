#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksIamRoleTypes } from '../lib/handlers/alks-iam-roletypes';

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

handleAlksIamRoleTypes(program);
