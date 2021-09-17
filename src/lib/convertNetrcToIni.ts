import { access, rm } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import {
  CREDENTIALS_FILE_PATH,
  getCredentials,
  setCredentials,
} from './state/credentials';
import netrc from 'node-netrc';

const NETRC_FILE_PATH = join(homedir(), '.netrc');

const ALKS_USERID = 'alksuid';
const ALKS_TOKEN = 'alksclitoken';

export async function convertNetrcToIni(): Promise<void> {
  const netrcFileExists = await access(NETRC_FILE_PATH)
    .then(() => true)
    .catch(() => false);
  const credentialsFileExists = await access(CREDENTIALS_FILE_PATH)
    .then(() => true)
    .catch(() => false);

  // If credentials file hasn't been created yet but .netrc has, populate data from .netrc
  if (netrcFileExists && !credentialsFileExists) {
    const credentials = await getCredentials();

    const passwordAuth = netrc(ALKS_USERID);
    if (passwordAuth.password) {
      credentials.password = passwordAuth.password;
    }

    const tokenAuth = netrc(ALKS_TOKEN);
    if (tokenAuth.password) {
      credentials.token = tokenAuth.password;
    }

    await setCredentials(credentials);
  }

  // remove the old .netrc file for security reasons
  if (netrcFileExists) {
    await rm(NETRC_FILE_PATH);
  }
}
