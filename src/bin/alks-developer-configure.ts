#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperConfigure } from '../lib/handlers/alks-developer-configure';

program
  .version(config.version)
  .description('configures developer')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksDeveloperConfigure(program);
