import { getKeytar } from './getKeytar';
import { log } from './log';
import netrc from 'node-netrc';

const SERVICE = 'alkscli';
const SERVICETKN = 'alksclitoken';
const ALKS_TOKEN = 'alkstoken';

export async function getTokenFromKeystore(): Promise<string | undefined> {
  try {
    const keytar = await getKeytar();
    return (await keytar.getPassword(SERVICE, ALKS_TOKEN)) ?? undefined;
  } catch (e) {
    log((e as Error).message);
    log('Failed to use keychain. Falling back to plaintext file');

    const auth = netrc(SERVICETKN);
    return auth.password ?? undefined;
  }
}
