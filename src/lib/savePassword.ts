import clc from 'cli-color';
import { log } from './log';
import { passwordSaveErrorHandler } from './passwordSaveErrorHandler';
import { storePassword } from './storePassword';

export async function savePassword(password: string) {
  try {
    await storePassword(password);
    console.error(clc.white('Password saved!'));
  } catch (err) {
    log('error saving password! ' + err.message);
    passwordSaveErrorHandler(err);
  }
}
