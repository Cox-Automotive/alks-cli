import { promises } from 'fs';
const { access, chmod, rename } = promises;
import { homedir } from 'os';
import { join } from 'path';
import { ALKS_CONFIG_FOLDER } from './configFolder';
import { DB_FILE_NAME } from './getDbFile';
import { log } from './log';

const OLD_DB_FILE_PATH = join(homedir(), DB_FILE_NAME);
const NEW_DB_FILE_PATH = join(ALKS_CONFIG_FOLDER, DB_FILE_NAME);

export async function updateDbFileLocation(): Promise<void> {
  try {
    const oldFileExists = await access(OLD_DB_FILE_PATH)
      .then(() => true)
      .catch(() => false);
    const newFileExists = await access(NEW_DB_FILE_PATH)
      .then(() => true)
      .catch(() => false);

    // If new file hasn't been created yet but the old file exists, move the old file to the new location
    if (oldFileExists && !newFileExists) {
      log('rename ' + OLD_DB_FILE_PATH + ' to ' + NEW_DB_FILE_PATH);
      await rename(OLD_DB_FILE_PATH, NEW_DB_FILE_PATH);

      // ensure the new file has the correct permissions
      await chmod(NEW_DB_FILE_PATH, 0o600);
    }
  } catch (e) {
    // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
    log('failed to move old db file to ALKS config folder: ' + e);
  }
}
