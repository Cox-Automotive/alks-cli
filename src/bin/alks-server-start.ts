#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksServerStart } from '../lib/handlers/alks-server-start';

program
  .version(config.version)
  .description('starts the metadata server')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksServerStart(program);
