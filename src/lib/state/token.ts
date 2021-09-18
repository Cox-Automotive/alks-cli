import { log } from '../log';
import { getTokenFromKeystore } from '../getTokenFromKeystore';
import { isEmpty } from 'underscore';
import { getEnvironmentVariableSecretWarning } from '../getEnvironmentVariableSecretWarning';
import { storeToken } from '../storeToken';
import { white } from 'cli-color';
import { getCredentials } from './credentials';
import { spawnSync } from 'child_process';

const TOKEN_ENV_VAR_NAME = 'ALKS_REFRESH_TOKEN';

export async function getToken(): Promise<string | undefined> {
  const tokenFromEnv = process.env[TOKEN_ENV_VAR_NAME];
  if (!isEmpty(tokenFromEnv)) {
    console.error(getEnvironmentVariableSecretWarning(TOKEN_ENV_VAR_NAME));
    log('using refresh token from environment variable');
    return tokenFromEnv as string;
  }

  const credentials = await getCredentials();
  if (credentials.credential_process) {
    const output = spawnSync(credentials.credential_process, ['token']);
    if (output.error) {
      log(
        'error encountered when executing credential process: ' + output.error
      );
      throw output.error;
    }
    if (String(output.stderr).trim().length > 0) {
      log('credential_process stderr: ' + output.stderr);
    }
    // read the first line of stdout as the password
    const token = String(output.stdout).split('\n')[0].trim();
    if (token.length > 0) {
      return token;
    }
  }

  const tokenFromKeystore = await getTokenFromKeystore();
  if (tokenFromKeystore) {
    log('using stored token');
    return tokenFromKeystore;
  }

  return undefined;
}

export async function setToken(token: string) {
  await storeToken(token);
  console.error(white('Refresh token saved!'));
}
