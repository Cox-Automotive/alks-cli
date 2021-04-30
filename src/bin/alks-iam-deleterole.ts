#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksIamDeleteRole } from '../lib/handlers/alks-iam-deleterole';

program
  .version(config.version)
  .description('remove an IAM role')
  .option('-n, --rolename [rolename]', 'the name of the role to delete')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksIamDeleteRole(program);
