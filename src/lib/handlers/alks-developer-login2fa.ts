import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { promptForToken } from '../promptForToken';
import { setToken } from '../state/token';
import { isUndefined } from 'underscore';
import { log } from '../log';

export async function handleAlksDeveloperLogin2fa(
  _options: commander.OptionValues
) {
  try {
    if (isUndefined(_options.token)) {
      await setToken(await promptForToken());

      await checkForUpdate();

      setTimeout(() => {
        process.exit(0);
      }, 1000); // needed for if browser is still open
    } else {
      log('trying to set token provided by cli');
      await setToken(_options.token);
    }
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
