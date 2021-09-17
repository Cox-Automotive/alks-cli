import { access, rename } from 'fs/promises';
import { getFilePathInHome } from './getFilePathInHome';
import chmod from 'chmod';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';

export async function getDbFile(): Promise<string> {
  // Handle migrating from the old path to the new path
  const path = getFilePathInHome('.alks-cli/alks.db');
  const oldPath = getFilePathInHome('alks.db');

  let dbFileExists: boolean = true;
  await access(path).catch(() => {
    dbFileExists = false;
  });

  let oldDbFileExists: boolean = true;
  await access(oldPath).catch(() => {
    oldDbFileExists = false;
  });

  if (oldDbFileExists && !dbFileExists) {
    await rename(oldPath, path);
    dbFileExists = true;
    oldDbFileExists = false;
  }

  // if we have a db, chmod it
  if (dbFileExists) {
    chmod(path, getOwnerReadWriteOnlyPermission());
  }

  return path;
}
