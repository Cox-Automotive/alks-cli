import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getPasswordFromPrompt } from '../getPasswordFromPrompt';
import { log } from '../log';
import { setPassword } from '../state/password';
import { trackActivity } from '../trackActivity';

export async function handleAlksDeveloperLogin(
  _options: commander.OptionValues
) {
  try {
    const password = await getPasswordFromPrompt();

    log('saving password');
    await setPassword(password);

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
