import { log } from '../log';
import { getDeveloper, updateDeveloper } from './developer';

export async function getAlksAccount(): Promise<string> {
  const developer = await getDeveloper();
  if (developer.alksAccount) {
    log('using stored alks account');
    return developer.alksAccount;
  }

  throw new Error(
    'Default ALKS Account is not configured. Please run: alks developer configure'
  );
}

export async function setAlksAccount(alksAccount: string) {
  await updateDeveloper({ alksAccount });
}
