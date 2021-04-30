import commander from 'commander';
import { log } from '../lib/log';
import { Auth } from '../model/auth';
import { getPassword } from './getPassword';
import { getToken } from './getToken';
import { getUserId } from './getUserId';

const logger = 'auth';

export async function getAuth(
  program: commander.Command,
  prompt: boolean = true
): Promise<Auth> {
  if (program.auth) {
    log(program, logger, 'using cached auth object');
    return program.auth;
  }

  log(program, logger, 'checking for access token');
  const token = await getToken();
  if (token) {
    const auth = { token };
    program.auth = auth;
    return auth;
  } else {
    log(program, logger, 'no access token found, falling back to password');
    const userid = await getUserId(program, prompt);
    const password = await getPassword(program, prompt);
    const auth = { userid, password };
    program.auth = auth;
    return auth;
  }
}
