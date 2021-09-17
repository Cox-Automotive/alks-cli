import { getKeytar } from './getKeytar';
import { log } from './log';
import { getCredentials } from './state/credentials';

const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

export async function getPasswordFromKeystore(): Promise<string | undefined> {
  try {
    const keytar = await getKeytar();
    return (await keytar.getPassword(SERVICE, ALKS_USERID)) ?? undefined;
  } catch (e) {
    log((e as Error).message);
    log('Failed to use keychain. Falling back to plaintext file');

    const credentials = await getCredentials();
    return credentials.password ?? undefined;
  }
}
