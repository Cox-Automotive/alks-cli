#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksSessions } from '../lib/handlers/alks-sessions';

program
  .version(config.version)
  .command('open', 'creates or resumes a session')
  .command('list', 'lists active sessions')
  .command('console', 'open an AWS console in your browser')
  .parse(process.argv);

handleAlksSessions(program);
