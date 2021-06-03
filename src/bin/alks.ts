#!/usr/bin/env node

process.title = 'ALKS';

import clc from 'cli-color';
import { version } from '../../package.json';
import { handleCommanderError } from '../lib/handlers/handleCommanderError';
import program from '../lib/program';

if (process.stdout.isTTY) {
  console.error(clc.whiteBright.bold('ALKS v%s'), version);
}

try {
  program.parseAsync().catch((err) => {
    handleCommanderError(program, err);
  });
} catch (err) {
  // We need to catch in both ways because some errors are thrown and others are rejected promises
  handleCommanderError(program, err);
}
