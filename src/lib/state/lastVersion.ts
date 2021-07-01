import { getDeveloper, updateDeveloper } from './developer';
import { version } from '../../../package.json';
import { log } from '../log';

export async function getLastVersion(): Promise<string> {
  const developer = await getDeveloper();
  if (developer.lastVersion) {
    log('using stored last version');
    return developer.lastVersion;
  }

  // Since this function is primarily used by checkForUpdate, just return the current version if this is the first time we're running the CLI so it doesn't show us what's new
  return version;
}

export async function setLastVersion(lastVersion: string) {
  await updateDeveloper({ lastVersion });
}
