import { join } from 'path';
import { isEmpty } from 'underscore';
import { getAlksConfigFolder } from './configFolder';
import { log } from './log';

export function getDbFileName() {
  return 'alks.db';
}

const DB_PATH_ENV_VAR_NAME = 'ALKS_DB';

export function getCustomDbFilePath(): string | undefined {
  const dbPathFromEnv = process.env[DB_PATH_ENV_VAR_NAME];
  if (!isEmpty(dbPathFromEnv)) {
    return dbPathFromEnv;
  }
  return undefined;
}

export async function getDbFile(): Promise<string> {
  const customDbFilePath = getCustomDbFilePath();
  if (customDbFilePath) {
    log('using alks.db file path from environment variable');
    return customDbFilePath;
  }

  return join(getAlksConfigFolder(), getDbFileName());
}
