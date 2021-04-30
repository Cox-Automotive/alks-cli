#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperLogin2fa } from '../lib/handlers/alks-developer-login2fa';

program
  .version(config.version)
  .description('stores your alks refresh token')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksDeveloperLogin2fa(program);
