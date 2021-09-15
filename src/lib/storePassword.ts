import { log } from './log';
import { getKeytar } from './getKeytar';
import netrc from 'node-netrc';
import chmod from 'chmod';
import { getFilePathInHome } from './getFilePathInHome';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';

const SERVICE = 'alkscli';
const ALKS_PASSWORD = 'alkspassword';

export async function storePassword(password: string): Promise<void> {
  log('storing password');
  try {
    const keytar = await getKeytar();
    await keytar.setPassword(SERVICE, ALKS_PASSWORD, password);
  } catch (e) {
    log((e as Error).message);
    log('Failed to use keychain. Falling back to plaintext file');

    netrc.update(ALKS_PASSWORD, {
      password,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerReadWriteOnlyPermission());
  }
}
