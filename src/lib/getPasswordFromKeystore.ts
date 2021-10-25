import { getKeytar } from './getKeytar';
import { log } from './log';
import { getCredentials } from './state/credentials';

const SERVICE = 'alkscli';
const ALKS_PASSWORD = 'alkspassword';

export async function getPasswordFromKeystore(): Promise<string | undefined> {
  try {
    const keytar = await getKeytar();
    return (await keytar.getPassword(SERVICE, ALKS_PASSWORD)) ?? undefined;
  } catch (e) {
    log((e as Error).message);
    log('Failed to use keychain. Checking for plaintext file');

    const credentials = await getCredentials();
    return credentials.password ?? undefined;
  }
}
