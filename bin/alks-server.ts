#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

import program from 'commander';
import * as utils from '../lib/utils';
import config from '../package.json';

program
  .version(config.version)
  .command('configure', 'configures the alks ec2 metadata server')
  .command('start', 'starts the alks ec2 metadata server')
  .command('stop', 'stops the alks ec2 metadat server')
  .parse(process.argv);

utils.subcommandSuggestion(program, 'server');
