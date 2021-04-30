#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { subcommandSuggestion } from '../lib/subcommandSuggestion';

program
  .version(config.version)
  .command('open', 'creates or resumes a session')
  .command('list', 'lists active sessions')
  .command('console', 'open an AWS console in your browser')
  .parse(process.argv);

subcommandSuggestion(program, 'sessions');
