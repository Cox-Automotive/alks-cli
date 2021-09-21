import { white } from 'cli-color';
import { isEmpty } from 'underscore';
import { getCredentialsFromProcess } from '../getCredentialsFromProcess';
import { getEnvironmentVariableSecretWarning } from '../getEnvironmentVariableSecretWarning';
import { getTokenFromKeystore } from '../getTokenFromKeystore';
import { log } from '../log';
import { storeToken } from '../storeToken';

const TOKEN_ENV_VAR_NAME = 'ALKS_REFRESH_TOKEN';

export async function getToken(): Promise<string | undefined> {
  const tokenFromEnv = process.env[TOKEN_ENV_VAR_NAME];
  if (!isEmpty(tokenFromEnv)) {
    console.error(getEnvironmentVariableSecretWarning(TOKEN_ENV_VAR_NAME));
    log('using refresh token from environment variable');
    return tokenFromEnv as string;
  }

  const credentialProcessResult = await getCredentialsFromProcess();
  if (credentialProcessResult.refresh_token) {
    log('using token from credential_process');
    return credentialProcessResult.refresh_token;
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
