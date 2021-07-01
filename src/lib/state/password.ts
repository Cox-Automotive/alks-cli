import program from '../program';
import { log } from '../log';
import { isEmpty } from 'underscore';
import { savePassword } from '../savePassword';
import { getPasswordFromKeystore } from '../getPasswordFromKeystore';

export async function getPassword() {
  const passwordOption = program.opts().password;
  if (passwordOption) {
    log('using password from CLI arg');
    return passwordOption;
  }

  const passwordFromEnv = process.env.ALKS_PASSWORD;
  if (!isEmpty(passwordFromEnv)) {
    log('using password from environment variable');
    return passwordFromEnv;
  }

  const passwordFromKeystore = await getPasswordFromKeystore();
  if (passwordFromKeystore) {
    log('using stored password');
    return passwordFromKeystore;
  }

  throw new Error('No password was configured');
}

export async function setPassword(password: string) {
  await savePassword(password);
}
