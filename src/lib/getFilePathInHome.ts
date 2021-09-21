import { join } from 'path';
import { homedir } from 'os';

export function getFilePathInHome(filename: string) {
  return join(homedir(), filename);
}
