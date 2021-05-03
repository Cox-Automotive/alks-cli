import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getPasswordFromPrompt } from '../getPasswordFromPrompt';
import { log } from '../log';
import { passwordSaveErrorHandler } from '../passwordSaveErrorHandler';
import { storePassword } from '../storePassword';
import { trackActivity } from '../tractActivity';

export async function handleAlksDeveloperLogin(
  _options: commander.OptionValues,
  program: commander.Command
) {
  const logger = 'dev-login';

  try {
    const password = await getPasswordFromPrompt();

    log(program, logger, 'saving password');
    try {
      await storePassword(password);
      console.error(clc.white('Password saved!'));
    } catch (err) {
      log(program, logger, 'error saving password! ' + err.message);
      passwordSaveErrorHandler(err);
    }

    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
