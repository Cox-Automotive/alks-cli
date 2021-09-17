import { log } from '../log';
import { getDeveloper, updateDeveloper } from './developer';

export async function getAlksRole(): Promise<string | undefined> {
  const developer = await getDeveloper();
  if (developer.alksRole) {
    log('using stored alks role');
    return developer.alksRole;
  }

  return undefined;
}

export async function setAlksRole(alksRole: string) {
  await updateDeveloper({ alksRole });
}
