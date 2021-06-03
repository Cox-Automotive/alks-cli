import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getPasswordFromPrompt } from '../getPasswordFromPrompt';
import { log } from '../log';
import { passwordSaveErrorHandler } from '../passwordSaveErrorHandler';
import { storePassword } from '../storePassword';
import { trackActivity } from '../trackActivity';

export async function handleAlksDeveloperLogin(
  _options: commander.OptionValues,
  _program: commander.Command
) {
  try {
    const password = await getPasswordFromPrompt();

    log('saving password');
    try {
      await storePassword(password);
      console.error(clc.white('Password saved!'));
    } catch (err) {
      log('error saving password! ' + err.message);
      passwordSaveErrorHandler(err);
    }

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
