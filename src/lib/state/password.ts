import program from '../program';
import { log } from '../log';
import { isEmpty } from 'underscore';
import { getPasswordFromKeystore } from '../getPasswordFromKeystore';
import { getEnvironmentVariableSecretWarning } from '../getEnvironmentVariableSecretWarning';
import { storePassword } from '../storePassword';
import { white } from 'cli-color';
import { getCredentials } from './credentials';
import { spawnSync } from 'child_process';

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

  const credentials = await getCredentials();
  if (credentials.credential_process) {
    const output = spawnSync(credentials.credential_process, ['password']);
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
    const password = String(output.stdout).split('\n')[0].trim();
    if (password.length > 0) {
      return password;
    }
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
