import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { promptForPassword } from '../promptForPassword';
import { promptForUserId } from '../promptForUserId';
import { setPassword } from '../state/password';
import { setUserId } from '../state/userId';
import { trackActivity } from '../trackActivity';

export async function handleAlksDeveloperLogin(
  _options: commander.OptionValues
) {
  try {
    const userId = await promptForUserId();
    log('saving user ID');
    await setUserId(userId);

    const password = await promptForPassword();
    log('saving password');
    await setPassword(password);

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
