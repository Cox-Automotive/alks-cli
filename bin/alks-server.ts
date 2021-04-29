#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import { subcommandSuggestion } from '../lib/utils';
import config from '../package.json';

program
  .version(config.version)
  .command('configure', 'configures the alks ec2 metadata server')
  .command('start', 'starts the alks ec2 metadata server')
  .command('stop', 'stops the alks ec2 metadat server')
  .parse(process.argv);

subcommandSuggestion(program, 'server');
