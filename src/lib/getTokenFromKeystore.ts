import { getKeytar } from './getKeytar';
import { log } from './log';
import { getCredentials } from './state/credentials';

const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';

export async function getTokenFromKeystore(): Promise<string | undefined> {
  try {
    const keytar = await getKeytar();
    const token = (await keytar.getPassword(SERVICE, ALKS_TOKEN)) ?? undefined;

    log(`found token "${token}" in keystore`, {
      unsafe: true,
      alt: `found token of ${
        token
          ? `${token.length} characters starting with "${token.substring(
              0,
              1
            )}"`
          : `undefined`
      } in keystore`,
    });

    return token;
  } catch (e) {
    log((e as Error).message);
    log('Failed to use keychain. Checking for plaintext file');

    const credentials = await getCredentials();
    return credentials.refresh_token ?? undefined;
  }
}
