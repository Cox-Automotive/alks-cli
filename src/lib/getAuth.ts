import commander from 'commander';
import { log } from '../lib/log';
import { Auth } from '../model/auth';
import { getPassword } from './getPassword';
import { getToken } from './getToken';
import { getUserId } from './getUserId';

const logger = 'auth';

// TODO: find a better way to handle this
export function saveAuth(newAuth: Auth) {
  auth = newAuth;
}

let auth: Auth;

export async function getAuth(
  program: commander.Command,
  prompt: boolean = true
): Promise<Auth> {
  if (auth) {
    log(program, logger, 'using cached auth object');
    return auth;
  }

  log(program, logger, 'checking for access token');
  const token = await getToken();
  if (token) {
    auth = { token };
    return auth;
  } else {
    log(program, logger, 'no access token found, falling back to password');
    const userid = await getUserId(program, prompt);
    const password = await getPassword(program, prompt);
    auth = { userid, password };
    return auth;
  }
}
