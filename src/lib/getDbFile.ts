import { accessSync, renameSync } from 'fs';
import { getFilePathInHome } from './getFilePathInHome';
import chmod from 'chmod';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';

export function getDbFile() {
  // Handle migrating from the old path to the new path
  const path = getFilePathInHome('.alks-cli/alks.db');
  const oldPath = getFilePathInHome('alks.db');

  let dbFileExists: boolean = true;
  try {
    accessSync(path);
  } catch {
    dbFileExists = false;
  }

  let oldDbFileExists: boolean = true;
  try {
    accessSync(oldPath);
  } catch {
    oldDbFileExists = false;
  }

  if (oldDbFileExists && !dbFileExists) {
    renameSync(oldPath, path);
    dbFileExists = true;
    oldDbFileExists = false;
  }

  // if we have a db, chmod it
  if (dbFileExists) {
    chmod(path, getOwnerReadWriteOnlyPermission());
  }

  return path;
}
