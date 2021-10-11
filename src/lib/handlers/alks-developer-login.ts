import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { promptForPassword } from '../promptForPassword';
import { promptForUserId } from '../promptForUserId';
import { setPassword } from '../state/password';
import { setUserId } from '../state/userId';

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

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
