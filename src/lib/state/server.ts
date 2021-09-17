import { isEmpty } from 'underscore';
import { log } from '../log';
import { getDeveloper, updateDeveloper } from './developer';

const SERVER_ENV_VAR_NAME = 'ALKS_SERVER';

export async function getServer(): Promise<string | undefined> {
  const serverFromEnv = process.env[SERVER_ENV_VAR_NAME];
  if (!isEmpty(serverFromEnv)) {
    log('using server url from environment variable');
    return serverFromEnv as string;
  }

  const developer = await getDeveloper();
  if (developer.server) {
    log('using stored server url');
    return developer.server;
  }

  return undefined;
}

export async function setServer(server: string) {
  await updateDeveloper({ server });
}
