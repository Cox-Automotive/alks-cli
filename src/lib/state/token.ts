import { log } from '../log';
import { saveToken } from '../saveToken';
import { getTokenFromKeystore } from '../getTokenFromKeystore';
import { isEmpty } from 'underscore';
import { getEnvironmentVariableSecretWarning } from '../getEnvironmentVariableSecretWarning';

const TOKEN_ENV_VAR_NAME = 'ALKS_REFRESH_TOKEN';

export async function getToken(): Promise<string> {
  const tokenFromEnv = process.env[TOKEN_ENV_VAR_NAME];
  if (!isEmpty(tokenFromEnv)) {
    console.error(getEnvironmentVariableSecretWarning(TOKEN_ENV_VAR_NAME));
    log('using refresh token from environment variable');
    return tokenFromEnv as string;
  }

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
