#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperInfo } from '../lib/handlers/alks-developer-info';

program
  .version(config.version)
  .description('shows current developer configuration')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksDeveloperInfo(program);
