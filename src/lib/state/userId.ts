import { getDeveloper, updateDeveloper } from './developer';
import program from '../program';
import { log } from '../log';
import { isEmpty } from 'underscore';

const USER_ID_ENV_VAR_NAME = 'ALKS_USERID';

export async function getUserId(): Promise<string | undefined> {
  const userIdOption = program.opts().userid;
  if (userIdOption) {
    log('using userid from CLI arg');
    return userIdOption;
  }

  const userIdFromEnv = process.env[USER_ID_ENV_VAR_NAME];
  if (!isEmpty(userIdFromEnv)) {
    log('using userid from environment variable');
    return userIdFromEnv as string;
  }

  const developer = await getDeveloper();
  if (developer.userid) {
    log('using stored userid');
    return developer.userid;
  }

  return undefined;
}

export async function setUserId(userId: string) {
  await updateDeveloper({ userid: userId });
}
