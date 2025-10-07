#!/usr/bin/env node

process.title = 'ALKS';

import clc from 'cli-color';
import { version } from '../../package.json';
import { ensureConfigFolderExists } from '../lib/configFolder';
import { convertNetrcToIni } from '../lib/convertNetrcToIni';
import { handleCommanderError } from '../lib/handlers/handleCommanderError';
import program from '../lib/program';
import { updateDbFileLocation } from '../lib/updateDbFileLocation';
import { log, initLogs } from '../lib/log';

if (process.stdout.isTTY) {
  console.error(clc.whiteBright.bold('ALKS v%s'), version);
}

(async function main() {
  const startTime = new Date();
  let programStartTime: Date | undefined;
  try {
    await ensureConfigFolderExists();
    await initLogs();
    await convertNetrcToIni();
    await updateDbFileLocation();

    programStartTime = new Date();
    await program.parseAsync();
  } catch (err) {
    logTime(startTime, programStartTime);
    // We need to catch in both ways because some errors are thrown and others are rejected promises
    handleCommanderError(program, err as Error);
  }
  logTime(startTime, programStartTime);
})();

function logTime(start: Date, programStart: Date | undefined) {
  const now = new Date();
  log(`time elapsed since start: ${now.getTime() - start.getTime()}`);
  if (programStart) {
    log(
      `time elapsed while parsing program: ${
        now.getTime() - programStart.getTime()
      }`
    );
  }
}

// trivial edit.
