import { log } from '../lib/log';
import { Auth } from '../model/auth';
import { promptForPassword } from './promptForPassword';
import { getPassword } from './state/password';
import { getToken } from './state/token';
import { getUserId } from './state/userId';

export async function getAuth(): Promise<Auth> {
  log('checking for refresh token');
  const token = await getToken().catch(() => undefined);
  if (token) {
    const auth = { token };
    return auth;
  } else {
    log('no refresh token found, falling back to password');

    const userid = await getUserId();
    // If password is not set, ask for a password
    const password = await getPassword().catch(() => promptForPassword());
    const auth = { userid, password };
    return auth;
  }
}
