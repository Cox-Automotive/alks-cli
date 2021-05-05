import { red } from 'cli-color';
import program from './program';

/**
 * Print an error and exit.
 *
 * If -v is passed, the error is printed, otherwise just the message.
 *
 * @example
 * errorAndExit('test'); // If no error is given it creates one
 *
 * @example
 * errorAndExit('test', new Error());
 *
 * @example
 * errorAndExit(new Error()); // If no message is given it uses the error's message
 *
 * @example
 * errorAndExit(new Error(), new Error()) // ignores the second error, only uses the first
 */
export function errorAndExit(message: string | Error, error?: Error) {
  if (typeof message !== 'string') {
    error = message;
    message = error.message;
  }

  if (!error) {
    error = new Error(message);
  }

  if (program.opts().verbose) {
    console.error(red(error.stack));
  } else {
    console.error(red(message));
  }

  process.exit(1);
}
