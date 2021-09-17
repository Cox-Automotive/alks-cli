import { access, rm, readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import {
  CREDENTIALS_FILE_PATH,
  getCredentials,
  setCredentials,
} from './state/credentials';
import netrc from 'node-netrc';
import { log } from './log';

const NETRC_FILE_PATH = join(homedir(), '.netrc');

const NETRC_ALKS_PASSWORD = 'alkscli';
const NETRC_ALKS_TOKEN = 'alksclitoken';

export async function convertNetrcToIni(): Promise<void> {
  try {
    const netrcFileExists = await access(NETRC_FILE_PATH)
      .then(() => true)
      .catch(() => false);
    const credentialsFileExists = await access(CREDENTIALS_FILE_PATH)
      .then(() => true)
      .catch(() => false);

    // If credentials file hasn't been created yet but .netrc has, populate data from .netrc
    if (netrcFileExists && !credentialsFileExists) {
      const credentials = await getCredentials();

      const passwordAuth = netrc(NETRC_ALKS_PASSWORD);
      if (passwordAuth.password) {
        credentials.password = passwordAuth.password;
        // remove the alks password from the netrc file
        netrc.update(NETRC_ALKS_PASSWORD);
      }

      const tokenAuth = netrc(NETRC_ALKS_TOKEN);
      if (tokenAuth.password) {
        credentials.token = tokenAuth.password;
        // remove the alks token from the netrc file
        netrc.update(NETRC_ALKS_PASSWORD);
      }

      await setCredentials(credentials);

      // remove the old .netrc file for security reasons if all it had was ALKS info
      if (netrcFileExists) {
        const netrcData = await readFile(NETRC_FILE_PATH, 'utf-8');
        if (netrcData.trim().length === 0) {
          await rm(NETRC_FILE_PATH);
        }
      }
    }
  } catch (e) {
    // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
    log('failed to convert netrc file to ini file: ' + e);
  }
}
