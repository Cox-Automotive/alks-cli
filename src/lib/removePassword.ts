import { log } from './log';
import { getKeytar } from './getKeytar';

const SERVICE = 'alkscli';
const ALKS_PASSWORD = 'alkspassword';

export async function removePassword(): Promise<void> {
  log('removing password');
  const keytar = await getKeytar();
  keytar.deletePassword(SERVICE, ALKS_PASSWORD);
}
