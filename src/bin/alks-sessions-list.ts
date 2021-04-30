#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleSessionsList } from '../lib/handlers/alks-sessions-list';

program
  .version(config.version)
  .description('list active sessions')
  .option('-p, --password [password]', 'my password')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleSessionsList(program);
