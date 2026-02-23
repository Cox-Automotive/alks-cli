import { yellow } from 'cli-color';
import { log } from '../lib/log';
import { Auth } from '../model/auth';
import { promptForPassword } from './promptForPassword';
import { showBorderedMessage } from './showBorderedMessage';
import { getPassword } from './state/password';
import { getToken } from './state/token';
import { getUserId } from './state/userId';

// TODO: refactor all calls to this function to do their own error handling so that we can just return Auth or undefined
export async function getAuth(): Promise<Auth> {
  log('checking for refresh token');
  const token = await getToken();
  if (token) {
    const auth = { token };
    return auth;
  } else {
    log('no refresh token found, falling back to password');

    const userid = await getUserId();
    if (!userid) {
      throw new Error(
        'No authentication information was found. Please run `alks developer configure`'
      );
    }
    // If password is not set, ask for a password
    const password = (await getPassword()) || (await promptForPassword());

    showBorderedMessage(
      80,
      yellow(
        '⚠  DEPRECATION WARNING: Basic Authentication (network password) will be\n' +
          '   retired on May 3rd. Please run `alks developer configure` to migrate\n' +
          '   to OAuth2 (refresh token) authentication.'
      )
    );

    const auth = { userid, password };
    return auth;
  }
}
