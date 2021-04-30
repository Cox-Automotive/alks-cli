#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperAccounts } from '../lib/handlers/alks-developer-accounts';

program
  .version(config.version)
  .description('shows current developer configuration')
  .option('-v, --verbose', 'be verbose')
  .option('-e, --export', 'export accounts to environment variables')
  .parse(process.argv);

handleAlksDeveloperAccounts(program);
