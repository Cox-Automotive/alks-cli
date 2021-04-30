#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksServerConfigure } from '../lib/handlers/alks-server-configure';

program
  .version(config.version)
  .description('configures the alks metadata server')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-i, --iam', 'create an IAM session')
  .option('-p, --password [password]', 'my password')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksServerConfigure(program);
