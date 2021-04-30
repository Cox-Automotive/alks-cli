import { red } from 'cli-color';

export function errorAndExit(errorMsg: string, errorObj?: Error) {
  console.error(red(errorMsg));
  if (errorObj) {
    console.error(red(JSON.stringify(errorObj, null, 4)));
  }
  process.exit(1);
}
