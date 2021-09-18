import { access, chmod, mkdir, rename } from 'fs/promises';
import { join } from 'path';
import { getFilePathInHome } from './getFilePathInHome';
import { log } from './log';
import { ALKS_CONFIG_FOLDER } from './state/credentials';

export const DB_FILE_NAME = 'alks.db';

export async function getDbFile(): Promise<string> {
  // Handle migrating from the old path to the new path
  const path = join(ALKS_CONFIG_FOLDER, DB_FILE_NAME);
  const oldPath = getFilePathInHome('alks.db');

  let dbFileExists: boolean = true;
  await access(path).catch(() => {
    log('no access to ' + path);
    dbFileExists = false;
  });

  let oldDbFileExists: boolean = true;
  await access(oldPath).catch(() => {
    log('no access to ' + oldPath);
    oldDbFileExists = false;
  });

  if (oldDbFileExists && !dbFileExists) {
    log('rename ' + oldPath + ' to ' + path);
    await rename(oldPath, path);
    dbFileExists = true;
    oldDbFileExists = false;
  }

  // if we have a db, chmod it
  if (dbFileExists) {
    await chmod(path, 0o600);
  } else {
    log('db file not found. A new db file will be created');
    // Ensure the folder exists
    await mkdir(ALKS_CONFIG_FOLDER).catch(() => {});
    // If you create a blank file, LokiJS fails silently. (i.e. don't do this)
    // await writeFile(path, '');
  }

  return path;
}
