import { log } from '../log';
import { getDeveloper, updateDeveloper } from './developer';

export async function getAlksAccount(): Promise<string | undefined> {
  const developer = await getDeveloper();
  if (developer.alksAccount) {
    log('using stored alks account');
    return developer.alksAccount;
  }

  return undefined;
}

export async function setAlksAccount(alksAccount: string) {
  await updateDeveloper({ alksAccount });
}
