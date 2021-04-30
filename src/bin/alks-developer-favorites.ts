#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperFavorites } from '../lib/handlers/alks-developer-favorites';

program
  .version(config.version)
  .description('configure which accounts are favorites')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksDeveloperFavorites(program);
