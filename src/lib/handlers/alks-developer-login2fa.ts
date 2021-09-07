import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { trackActivity } from '../trackActivity';
import { promptForToken } from '../promptForToken';
import { setToken } from '../state/token';

export async function handleAlksDeveloperLogin2fa(
  _options: commander.OptionValues
) {
  try {
    await setToken(await promptForToken());

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();

    setTimeout(() => {
      process.exit(0);
    }, 1000); // needed for if browser is still open
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
