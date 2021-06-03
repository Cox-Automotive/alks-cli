import { yellow } from 'cli-color';
import { getCallerInfo } from './getCallerInfo';
import program from './program';

export interface LogOptions {
  verbose?: boolean; // whether to print to console (defaults to whether -v flag was passed)
  prefix?: string; // The string to replace the caller's file name, line number, and character position
}

export function log(msg: string, opts: LogOptions = {}) {
  let prefix = opts.prefix;
  if (!prefix) {
    const caller = getCallerInfo();
    prefix = `${caller.fileName}:${caller.line}:${caller.char}`;
  }

  const verbose: boolean =
    opts.verbose === undefined ? program.opts().verbose : opts.verbose;

  if (verbose) {
    console.error(yellow(`[${prefix}]: ${msg}`));
  }
}
