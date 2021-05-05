#!/usr/bin/env node

process.title = 'ALKS';

import clc from 'cli-color';
import { version } from '../../package.json';
import { handleCommanderError } from '../lib/handlers/handleCommanderError';
import program from '../lib/program';

if (process.stdout.isTTY) {
  console.error(clc.whiteBright.bold('ALKS v%s'), version);
}

program.parseAsync().catch((err) => {
  handleCommanderError(program, err);
});
