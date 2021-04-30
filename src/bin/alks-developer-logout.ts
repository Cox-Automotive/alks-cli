#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperLogout } from '../lib/handlers/alks-developer-logout';

program
  .version(config.version)
  .description('removes password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksDeveloperLogout(program);
