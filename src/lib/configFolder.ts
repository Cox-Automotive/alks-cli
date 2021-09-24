import { promises } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { log } from './log';
const { mkdir } = promises;

export function getAlksConfigFolder() {
  return join(homedir(), '.alks-cli');
}

export async function ensureConfigFolderExists(): Promise<void> {
  // ensure the alks config folder exists
  await mkdir(getAlksConfigFolder()).catch((err: Error) => {
    if (err.message.includes('EEXISTS')) {
      log('config folder already exists');
    } else {
      throw err;
    }
  });
}
