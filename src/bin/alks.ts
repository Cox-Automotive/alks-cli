#!/usr/bin/env node

process.title = 'ALKS';

import clc from 'cli-color';
import { version } from '../../package.json';
import { ensureConfigFolderExists } from '../lib/configFolder';
import { convertNetrcToIni } from '../lib/convertNetrcToIni';
import { handleCommanderError } from '../lib/handlers/handleCommanderError';
import program from '../lib/program';
import { updateDbFileLocation } from '../lib/updateDbFileLocation';

if (process.stdout.isTTY) {
  console.error(clc.whiteBright.bold('ALKS v%s'), version);
}

(async function main() {
  try {
    await ensureConfigFolderExists();
    await convertNetrcToIni();
    await updateDbFileLocation();

    await program.parseAsync();
  } catch (err) {
    // We need to catch in both ways because some errors are thrown and others are rejected promises
    handleCommanderError(program, err as Error);
  }
})();
