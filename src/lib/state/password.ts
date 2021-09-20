import { white } from 'cli-color';
import { isEmpty } from 'underscore';
import { getCredentialsFromProcess } from '../getCredentialsFromProcess';
import { getEnvironmentVariableSecretWarning } from '../getEnvironmentVariableSecretWarning';
import { getPasswordFromKeystore } from '../getPasswordFromKeystore';
import { log } from '../log';
import program from '../program';
import { storePassword } from '../storePassword';

const PASSWORD_ENV_VAR_NAME = 'ALKS_PASSWORD';
let cachedPassword: string | undefined;

export async function getPassword(): Promise<string | undefined> {
  const passwordOption = program.opts().password;
  if (passwordOption) {
    log('using password from CLI arg');
    console.error(
      'Warning: Passing secrets via cli options is unsafe. Please instead run `alks developer configure`, `alks-developer-login`, or set the ALKS_PASSWORD environment variable'
    );
    return passwordOption;
  }

  const passwordFromEnv = process.env[PASSWORD_ENV_VAR_NAME];
  if (!isEmpty(passwordFromEnv)) {
    console.error(getEnvironmentVariableSecretWarning(PASSWORD_ENV_VAR_NAME));
    log('using password from environment variable');
    return passwordFromEnv as string;
  }

  const credentialProcessResult = await getCredentialsFromProcess();
  if (credentialProcessResult.password) {
    log('using password from credential_process');
    return credentialProcessResult.password;
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

  return undefined;
}

export async function setPassword(password: string) {
  await storePassword(password);
  console.error(white('Password saved!'));
}

// Allows temporarily setting a password so that actions like configuring developer can work without having to save your password
export function cachePassword(password: string): void {
  cachedPassword = password;
}
