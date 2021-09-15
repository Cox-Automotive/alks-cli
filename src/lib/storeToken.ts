import { log } from './log';
import { getKeytar } from './getKeytar';
import netrc from 'node-netrc';
import chmod from 'chmod';
import { getFilePathInHome } from './getFilePathInHome';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';
import { red } from 'cli-color';
import { confirm } from './confirm';

const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';

export async function storeToken(token: string): Promise<void> {
  log('storing token');
  try {
    const keytar = await getKeytar();
    await keytar.setPassword(SERVICE, ALKS_TOKEN, token);
  } catch (e) {
    log((e as Error).message);
    log('Failed to use keychain. Falling back to plaintext file');

    console.error(red('No keychain could be found for storing the token'));
    const confirmation = await confirm(
      'Would you like to store your token in a plaintext file? (Not Recommended)',
      false
    );
    if (!confirmation) {
      throw new Error('Failed to save token');
    }

    netrc.update(ALKS_TOKEN, {
      password: token,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerReadWriteOnlyPermission());
  }
}
