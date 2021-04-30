import { passwordSaveErrorHandler } from './passwordSaveErrorHandler';
import { storePassword } from './storePassword';

export async function savePassword(password: string) {
  try {
    await storePassword(password);
  } catch (e) {
    passwordSaveErrorHandler(e);
  }
}
