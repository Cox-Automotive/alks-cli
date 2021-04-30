#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksServer } from '../lib/handlers/alks-server';

program
  .version(config.version)
  .command('configure', 'configures the alks ec2 metadata server')
  .command('start', 'starts the alks ec2 metadata server')
  .command('stop', 'stops the alks ec2 metadat server')
  .parse(process.argv);

handleAlksServer(program);
