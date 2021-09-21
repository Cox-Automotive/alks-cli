import { log } from './log';
import { getKeytar } from './getKeytar';
import { confirm } from './confirm';
import { red } from 'cli-color';
import { getCredentials, setCredentials } from './state/credentials';

const SERVICE = 'alkscli';
const ALKS_PASSWORD = 'alkspassword';

export async function storePassword(password: string): Promise<void> {
  log('storing password');
  try {
    const keytar = await getKeytar();
    await keytar.setPassword(SERVICE, ALKS_PASSWORD, password);
  } catch (e) {
    log((e as Error).message);

    console.error(red('No keychain could be found for storing the password'));
    const confirmation = await confirm(
      'Would you like to store your password in a plaintext file? (Not Recommended)',
      false
    );
    if (!confirmation) {
      throw new Error('Failed to save password');
    }

    const credentials = await getCredentials();
    credentials.password = password;
    await setCredentials(credentials);
  }
}
