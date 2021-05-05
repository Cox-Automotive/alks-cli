import commander from 'commander';
import { log } from '../lib/log';
import { Auth } from '../model/auth';
import { getPassword } from './getPassword';
import { getToken } from './getToken';
import { getUserId } from './getUserId';

// TODO: find a better way to handle this
export function cacheAuth(newAuth: Auth) {
  auth = newAuth;
}

let auth: Auth;

export async function getAuth(
  program: commander.Command,
  prompt: boolean = true
): Promise<Auth> {
  log('checking for access token');
  const token = await getToken();
  if (token) {
    auth = { token };
    return auth;
  } else {
    log('no access token found, falling back to password');

    if (auth) {
      log('using cached auth object');
      return auth;
    }

    const userid = await getUserId(program, prompt);
    const password = await getPassword(program, prompt);
    auth = { userid, password };
    return auth;
  }
}
