#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksIamDeleteLtk } from '../lib/handlers/alks-iam-deleteltk';

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

handleAlksIamDeleteLtk(program);
