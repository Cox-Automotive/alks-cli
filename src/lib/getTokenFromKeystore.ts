import { getKeytar } from './getKeytar';
import { log } from './log';
import { getCredentials } from './state/credentials';

const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';

export async function getTokenFromKeystore(): Promise<string | undefined> {
  try {
    const keytar = await getKeytar();
    return (await keytar.getPassword(SERVICE, ALKS_TOKEN)) ?? undefined;
  } catch (e) {
    log((e as Error).message);
    log('Failed to use keychain. Checking for plaintext file');

    const credentials = await getCredentials();
    return credentials.token ?? undefined;
  }
}
