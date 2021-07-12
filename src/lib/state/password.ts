import program from '../program';
import { log } from '../log';
import { isEmpty } from 'underscore';
import { savePassword } from '../savePassword';
import { getPasswordFromKeystore } from '../getPasswordFromKeystore';
import { getEnvironmentVariableSecretWarning } from '../getEnvironmentVariableSecretWarning';

const PASSWORD_ENV_VAR_NAME = 'ALKS_PASSWORD';
let cachedPassword: string;

export async function getPassword(): Promise<string> {
  const passwordOption = program.opts().password;
  if (passwordOption) {
    log('using password from CLI arg');
    return passwordOption;
  }

  const passwordFromEnv = process.env[PASSWORD_ENV_VAR_NAME];
  if (!isEmpty(passwordFromEnv)) {
    console.error(getEnvironmentVariableSecretWarning(PASSWORD_ENV_VAR_NAME));
    log('using password from environment variable');
    return passwordFromEnv as string;
  }

  const passwordFromKeystore = await getPasswordFromKeystore();
  if (passwordFromKeystore) {
    log('using stored password');
    return passwordFromKeystore;
  }

  if (cachedPassword) {
    log('using cached password');
    return cachedPassword;
  }

  throw new Error('No password was configured');
}

export async function setPassword(password: string) {
  await savePassword(password);
}

// Allows temporarily setting a password so that actions like configuring developer can work without having to save your password
export function cachePassword(password: string): void {
  cachedPassword = password;
}
