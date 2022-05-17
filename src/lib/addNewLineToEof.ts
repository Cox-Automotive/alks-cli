import { appendFileSync } from 'fs';
import { EOL } from 'os';
import { errorAndExit } from './errorAndExit';

/**
 * Adds an EOL character to the end of a file
 */
export function addNewLineToEof(file: string) {
  try {
    appendFileSync(file, EOL);
  } catch (err) {
    errorAndExit('Error adding new line!', err as Error);
  }
}
