#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import config from '../../package.json';
import { handleAlksIamCreateRole } from '../lib/handlers/alks-iam-createrole';

const roleNameDesc = 'alphanumeric including @+=._-';

program
  .version(config.version)
  .description('creates a new IAM role')
  .option('-n, --rolename [rolename]', 'the name of the role, ' + roleNameDesc)
  .option(
    '-t, --roletype [roletype]',
    'the role type, to see available roles: alks iam roletypes'
  )
  .option(
    '-d, --defaultPolicies',
    'include default policies, default: false',
    false
  )
  .option(
    '-e, --enableAlksAccess',
    'enable alks access (MI), default: false',
    false
  )
  .option('-a, --account [alksAccount]', 'alks account to use')
  .option('-r, --role [alksRole]', 'alks role to use')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

handleAlksIamCreateRole(program);
