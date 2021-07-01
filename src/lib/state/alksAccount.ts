import { log } from '../log';
import { getDeveloper, updateDeveloper } from './developer';

export async function getAlksAccount() {
  const developer = await getDeveloper();
  if (developer.alksAccount) {
    log('using stored alks account');
    return developer.alksAccount;
  }

  throw new Error(
    'ALKS CLI is not configured. Please run: alks developer configure'
  );
}

export async function setAlksAccount(alksAccount: string) {
  await updateDeveloper({ alksAccount });
}
