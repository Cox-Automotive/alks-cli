#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

import program from 'commander';
import * as utils from '../lib/utils';
import config from '../package.json';

program
  .version(config.version)
  .command('open', 'creates or resumes a session')
  .command('list', 'lists active sessions')
  .command('console', 'open an AWS console in your browser')
  .parse(process.argv);

utils.subcommandSuggestion(program, 'sessions');
