import { promises as fsPromises } from 'fs';
const { access, rm, readFile } = fsPromises;
import { join } from 'path';
import { homedir } from 'os';
import { getCredentials, setCredentials } from './state/credentials';
import netrc from 'node-netrc';
import { log } from './log';
import { getCredentialsFilePath } from './state/credentials';

const NETRC_FILE_PATH = join(homedir(), '.netrc');

const NETRC_ALKS_PASSWORD = 'alkscli';
const NETRC_ALKS_TOKEN = 'alksclitoken';

export async function convertNetrcToIni(): Promise<void> {
  log('checking if netrc file exists');
  try {
    const netrcFileExists = await access(NETRC_FILE_PATH)
      .then(() => true)
      .catch(() => false);
    const credentialsFileExists = await access(getCredentialsFilePath())
      .then(() => true)
      .catch(() => false);

    // If credentials file hasn't been created yet but .netrc has, populate data from .netrc
    if (netrcFileExists && !credentialsFileExists) {
      log('converting netrc file to credentials file');
      const credentials = await getCredentials();

      const passwordAuth = netrc(NETRC_ALKS_PASSWORD);
      if (passwordAuth.password) {
        log('converting password auth');
        credentials.password = passwordAuth.password;
        // remove the alks password from the netrc file
        netrc.update(NETRC_ALKS_PASSWORD);
      }

      const tokenAuth = netrc(NETRC_ALKS_TOKEN);
      if (tokenAuth.password) {
        log('converting token auth');
        credentials.refresh_token = tokenAuth.password;
        // remove the alks token from the netrc file
        netrc.update(NETRC_ALKS_PASSWORD);
      }

      log('writing credentials file');
      await setCredentials(credentials);

      // remove the old .netrc file for security reasons if all it had was ALKS info
      if (netrcFileExists) {
        const netrcData = await readFile(NETRC_FILE_PATH, 'utf-8');
        if (netrcData.trim().length === 0) {
          log('removing netrc file');
          await rm(NETRC_FILE_PATH);
        }
      }
    }
  } catch (e) {
    // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
    log('failed to convert netrc file to ini file: ' + e);
  }
}
