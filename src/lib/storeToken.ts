import { log } from './log';
import { getKeytar } from './getKeytar';

const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';

export async function storeToken(token: string): Promise<void> {
  log('storing token');
  const keytar = await getKeytar();
  await keytar.setPassword(SERVICE, ALKS_TOKEN, token);
}
