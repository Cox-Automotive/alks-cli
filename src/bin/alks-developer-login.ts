#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperLogin } from '../lib/handlers/alks-developer-login';

program
  .version(config.version)
  .description('stores password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksDeveloperLogin(program);
