#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksIamCreateLtk } from '../lib/handlers/alks-iam-createltk';

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

handleAlksIamCreateLtk(program);
