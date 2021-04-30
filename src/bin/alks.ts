#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import pkg from '../../package.json';
import { handleAlks } from '../lib/handlers/alks';

program
  .command('sessions', 'manage aws sessions')
  .command('iam', 'manage iam resources')
  .command('developer', 'developer & account commands')
  .command('server', 'ec2 metadata server')
  .version(pkg.version)
  .parse(process.argv);

handleAlks(program);
