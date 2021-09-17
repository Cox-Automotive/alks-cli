import { log } from './log';
import { getKeytar } from './getKeytar';

const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';

export async function removeToken() {
  log('removing token');
  const keytar = await getKeytar();
  keytar.deletePassword(SERVICE, ALKS_TOKEN);
}
