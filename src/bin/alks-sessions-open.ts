#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { getOutputValues } from '../lib/getOutputValues';
import { handleAlksSessionsOpen } from '../lib/handlers/alks-sessions-open';

const outputValues = getOutputValues();

program
  .version(config.version)
  .description('creates or resumes a session')
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-i, --iam', 'create an IAM session')
  .option('-p, --password [password]', 'my password')
  .option(
    '-o, --output [format]',
    'output format (' + outputValues.join(', ') + ')'
  )
  .option(
    '-n, --namedProfile [profile]',
    'if output is set to creds, use this profile, default: default'
  )
  .option(
    '-f, --force',
    'if output is set to creds, force overwriting of AWS credentials'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-N, --newSession', 'forces a new session to be generated')
  .option(
    '-d, --default',
    'uses your default account from "alks developer configure"'
  )
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksSessionsOpen(program);
