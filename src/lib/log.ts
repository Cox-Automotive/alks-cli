import { yellow } from 'cli-color';
import { getCallerInfo } from './getCallerInfo';
import program from './program';

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
}
