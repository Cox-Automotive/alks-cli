import e from 'express';
import { promises } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { log } from './log';
const { mkdir } = promises;

export const ALKS_CONFIG_FOLDER = join(homedir(), '.alks-cli');

export async function ensureConfigFolderExists(): Promise<void> {
  // ensure the alks config folder exists
  await mkdir(ALKS_CONFIG_FOLDER).catch((err: Error) => {
    if (err.message.includes('EEXISTS')) {
      log('config folder already exists');
    } else {
      throw e;
    }
  });
}
