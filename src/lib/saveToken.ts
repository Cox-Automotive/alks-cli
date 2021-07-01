import { passwordSaveErrorHandler } from './passwordSaveErrorHandler';
import { storeToken } from './storeToken';
import clc from 'cli-color';
import { log } from './log';

export async function saveToken(token: string) {
  try {
    await storeToken(token);
    console.error(clc.white('Refresh token saved!'));
  } catch (err) {
    log('error saving token! ' + err.message);
    passwordSaveErrorHandler(err);
  }
}
