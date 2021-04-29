#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import { subcommandSuggestion } from '../lib/utils';
import config from '../package.json';

program
  .version(config.version)
  .command('createrole', 'create IAM role')
  .command('createtrustrole', 'create IAM trust role')
  .command('deleterole', 'remove an IAM role')
  .command('roletypes', 'list the available iam role types')
  .command('createltk', 'create a longterm key')
  .command('deleteltk', 'delete a longterm key')
  .parse(process.argv);

subcommandSuggestion(program, 'iam');
