import { log } from './log';
import { getKeytar } from './getKeytar';

const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

export async function removePassword(): Promise<void> {
  log('removing password');
  const keytar = await getKeytar();
  keytar.deletePassword(SERVICE, ALKS_USERID);
}
