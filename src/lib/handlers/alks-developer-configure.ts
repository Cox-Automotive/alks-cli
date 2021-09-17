import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { confirm } from '../confirm';
import { errorAndExit } from '../errorAndExit';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { log } from '../log';
import { promptForOutputFormat } from '../promptForOutputFormat';
import { promptForPassword } from '../promptForPassword';
import { promptForServer } from '../promptForServer';
import { promptForUserId } from '../promptForUserId';
import { trackActivity } from '../trackActivity';
import { setServer } from '../state/server';
import { setUserId } from '../state/userId';
import { setAlksAccount } from '../state/alksAccount';
import { setAlksRole } from '../state/alksRole';
import { setOutputFormat } from '../state/outputFormat';
import { promptForToken } from '../promptForToken';
import {
  promptForAuthType,
  REFRESH_TOKEN_AUTH_CHOICE,
  PASSWORD_AUTH_CHOICE,
  ALWAYS_ASK_AUTH_CHOICE,
} from '../promptForAuthType';
import { validateAlksAccount } from '../validateAlksAccount';
import tabtab from 'tabtab';
import { setToken } from '../state/token';
import { setPassword } from '../state/password';

export async function handleAlksDeveloperConfigure(
  options: commander.OptionValues
) {
  try {
    await setServer(options.server ?? (await promptForServer()));

    await setUserId(options.username ?? (await promptForUserId()));

    // Prompt for auth type if none was chosen
    const authType = options.authType ?? (await promptForAuthType());

    switch (authType) {
      case REFRESH_TOKEN_AUTH_CHOICE: {
        await setToken(await promptForToken());
        break;
      }
      case PASSWORD_AUTH_CHOICE: {
        const password = await promptForPassword();
        const savePasswordAnswer = await confirm('Save password');
        if (savePasswordAnswer) {
          await setPassword(password);
        }
        break;
      }
      case ALWAYS_ASK_AUTH_CHOICE: {
        // do nothing
        break;
      }
      default: {
        throw new Error('Invalid auth type selected');
      }
    }

    if (!options.account || !options.role) {
      log('Getting ALKS accounts');
      const { alksAccount, alksRole } = await promptForAlksAccountAndRole({
        prompt: 'Please select your default ALKS account/role',
      });
      await setAlksAccount(alksAccount);
      await setAlksRole(alksRole);
    } else {
      await validateAlksAccount(options.account, options.role);
      await setAlksAccount(options.account);
      await setAlksRole(options.role);
    }

    log('Getting output formats');
    setOutputFormat(options.format ?? (await promptForOutputFormat()));

    // create developer
    console.error(clc.white('Your developer configuration has been updated.'));

    await tabtab.install({
      name: 'alks',
      completer: 'alks',
    });

    log('checking for update');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit('Error configuring developer: ' + err.message, err);
  }
}
