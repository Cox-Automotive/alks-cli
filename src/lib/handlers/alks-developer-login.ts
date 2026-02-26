import commander from 'commander';
import { yellow } from 'cli-color';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { promptForPassword } from '../promptForPassword';
import { promptForUserId } from '../promptForUserId';
import { showBorderedMessage } from '../showBorderedMessage';
import { setPassword } from '../state/password';
import { setUserId } from '../state/userId';

export async function handleAlksDeveloperLogin(
  options: commander.OptionValues
) {
  try {
    showBorderedMessage(
      80,
      yellow(
        '⚠  DEPRECATION WARNING: Basic Authentication (network password) will be\n' +
          '   retired on May 3rd. Please use `alks developer configure` to set up\n' +
          '   OAuth2 (refresh token) authentication instead.'
      )
    );

    const userId = options.username ?? (await promptForUserId());
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
