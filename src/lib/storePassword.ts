import { log } from './log';
import { getKeytar } from './getKeytar';

const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

export async function storePassword(password: string) {
  log('storing password');
  const keytar = await getKeytar();
  await keytar.setPassword(SERVICE, ALKS_USERID, password);
}
