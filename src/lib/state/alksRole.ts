import { log } from '../log';
import { getDeveloper, updateDeveloper } from './developer';

export async function getAlksRole() {
  const developer = await getDeveloper();
  if (developer.alksRole) {
    log('using stored alks role');
    return developer.alksRole;
  }

  throw new Error(
    'ALKS CLI is not configured. Please run: alks developer configure'
  );
}

export async function setAlksRole(alksRole: string) {
  await updateDeveloper({ alksRole });
}
