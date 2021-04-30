#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksServerStop } from '../lib/handlers/alks-server-stop';

program
  .version(config.version)
  .description('stops the metadata server')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksServerStop(program);
