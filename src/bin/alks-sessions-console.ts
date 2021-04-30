#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksSessionsConsole } from '../lib/handlers/alks-sessions-console';

program
  .version(config.version)
  .description('open an AWS console in your browser')
  .option('-u, --url', 'just print the url')
  .option('-o, --openWith [appName]', 'open in a different app (optional)')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-i, --iam', 'create an IAM session')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-p, --password [password]', 'my password')
  .option('-N, --newSession', 'forces a new session to be generated')
  .option(
    '-d, --default',
    'uses your default account from "alks developer configure"'
  )
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksSessionsConsole(program);
