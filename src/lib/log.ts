import { yellow } from 'cli-color';
import { getCallerInfo } from './getCallerInfo';
import program from './program';
import { promises } from 'fs';
import { getAlksLogFolder } from './folders';
import { join } from 'path';
const { mkdir, appendFile } = promises;

const defaultLogFileName = 'alks.log';

export interface LogOptions {
  verbose?: boolean; // whether to print to console (defaults to whether -v flag was passed)
  prefix?: string; // The string to replace the caller's file name, line number, and character position
  unsafe?: boolean; // If true, indicates the output is unsafe to print and will only be printed when the --unsafe-verbose flag is passed
  alt?: string; // An alternative message to print if unsafe is true but the --unsafe-verbose flag is not passed
}

export function log(msg: string, opts: LogOptions = {}) {
  let prefix = opts.prefix;
  if (!prefix) {
    const caller = getCallerInfo();
    prefix = `${caller.fileName}:${caller.line}:${caller.char}`;
  }

  const verbose: boolean =
    opts.verbose === undefined
      ? program.opts().verbose || program.opts().unsafeVerbose
      : opts.verbose;

  if (opts.unsafe && !program.opts().unsafeVerbose) {
    if (opts.alt) {
      msg = opts.alt;
    } else {
      // Don't log anything
      return;
    }
  }

  if (verbose) {
    console.error(yellow(`[${prefix}]: ${msg}`));
  }

  writeLogToFile(msg, { ...opts });
}

export async function initLogs(filename?: string): Promise<void> {
  if (!filename) {
    filename = defaultLogFileName;
  }

  // ensure the alks log folder exists
  await mkdir(getAlksLogFolder()).catch((err: Error) => {
    if (err.message.includes('EEXIST')) {
    } else {
      throw err;
    }
  });

  await appendFile(
    join(getAlksLogFolder(), filename),
    `--- ${process.argv.join(' ')} ---\n`
  );
}

export interface WriteLogToFileOptions {
  filename?: string;
  unsafe?: boolean;
  alt?: string;
  prefix?: string;
}

async function writeLogToFile(
  data: string,
  opts?: WriteLogToFileOptions
): Promise<void> {
  const filename = opts?.filename ?? defaultLogFileName;
  const logFile = join(getAlksLogFolder(), filename);
  const time = new Date().toISOString();

  // Omit writing unsafe data to log file
  if (opts?.unsafe) {
    if (opts?.alt) {
      data = opts.alt;
    } else {
      // Don't write anything
      return;
    }
  }

  const prefix = opts?.prefix ? `[${opts.prefix}] ` : '';

  try {
    await appendFile(logFile, `${time} - ${prefix}${data}\n`);
  } catch (err) {
    // do nothing
  }
}
