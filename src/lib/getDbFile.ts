import { join } from 'path';
import { getAlksConfigFolder } from './configFolder';

export function getDbFileName() {
  return 'alks.db';
}

export async function getDbFile(): Promise<string> {
  return join(getAlksConfigFolder(), getDbFileName());
}
