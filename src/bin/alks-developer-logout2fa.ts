#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksDeveloperLogout2fa } from '../lib/handlers/alks-developer-logout2fa';

program
  .version(config.version)
  .description('removes alks refresh token')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksDeveloperLogout2fa(program);
