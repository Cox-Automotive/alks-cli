import { log } from '../lib/log';
import { Auth } from '../model/auth';
import { getPassword } from './state/password';
import { getToken } from './state/token';
import { getUserId } from './state/userId';

export async function getAuth(): Promise<Auth> {
  log('checking for refresh token');
  const token = await getToken();
  if (token) {
    const auth = { token };
    return auth;
  } else {
    log('no refresh token found, falling back to password');

    const userid = await getUserId();
    const password = await getPassword();
    const auth = { userid, password };
    return auth;
  }
}
