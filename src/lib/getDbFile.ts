import { existsSync } from 'fs';
import { getFilePathInHome } from './getFilePathInHome';
import chmod from 'chmod';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';

export function getDbFile() {
  const path = process.env.ALKS_DB || getFilePathInHome('alks.db');

  // if we have a db, chmod it
  if (existsSync(path)) {
    chmod(path, getOwnerReadWriteOnlyPermission());
  }

  return path;
}
