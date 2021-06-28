import { log } from '../log';
import { getDeveloper, updateDeveloper } from './developer';

export const defaultServer = 'https://alks.coxautoinc.com/rest';

export async function getServer() {
  const developer = await getDeveloper();
  if (developer.server) {
    log('using stored server url');
    return developer.server;
  }

  throw new Error(
    'ALKS CLI is not configured. Please run: alks developer configure'
  );
}

export async function setServer(server: string) {
  await updateDeveloper({ server });
}
