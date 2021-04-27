#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

import program from 'commander';
import config from '../package.json';
import * as utils from '../lib/utils';

program
  .version(config.version)
  .command('createrole', 'create IAM role')
  .command('createtrustrole', 'create IAM trust role')
  .command('deleterole', 'remove an IAM role')
  .command('roletypes', 'list the available iam role types')
  .command('createltk', 'create a longterm key')
  .command('deleteltk', 'delete a longterm key')
  .parse(process.argv);

utils.subcommandSuggestion(program, 'iam');
