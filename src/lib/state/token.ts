import { log } from '../log';
import { saveToken } from '../saveToken';
import { getTokenFromKeystore } from '../getTokenFromKeystore';

export async function getToken() {
  const tokenFromKeystore = await getTokenFromKeystore();
  if (tokenFromKeystore) {
    log('using stored token');
    return tokenFromKeystore;
  }

  throw new Error('No token was configured');
}

export async function setToken(token: string) {
  await saveToken(token);
}
