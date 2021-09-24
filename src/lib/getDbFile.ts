import { join } from 'path';
import { ALKS_CONFIG_FOLDER } from './state/credentials';

export const DB_FILE_NAME = 'alks.db';

export async function getDbFile(): Promise<string> {
  return join(ALKS_CONFIG_FOLDER, DB_FILE_NAME);
}
