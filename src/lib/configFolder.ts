import { promises } from 'fs';
import { log } from './log';
import { getAlksConfigFolder } from './folders';
const { mkdir } = promises;

export async function ensureConfigFolderExists(): Promise<void> {
  log('ensuring config folder exists');
  // ensure the alks config folder exists
  await mkdir(getAlksConfigFolder()).catch((err: Error) => {
    if (err.message.includes('EEXIST')) {
      log('config folder already exists');
    } else {
      throw err;
    }
  });
}
