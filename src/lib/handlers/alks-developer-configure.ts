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
import { savePassword } from '../savePassword';
import { trackActivity } from '../trackActivity';
import { setServer } from '../state/server';
import { setUserId } from '../state/userId';
import { setAlksAccount } from '../state/alksAccount';
import { setAlksRole } from '../state/alksRole';
import { setOutputFormat } from '../state/outputFormat';
import { saveToken } from '../saveToken';
import { promptForToken } from '../promptForToken';
import { promptForAuthType } from '../promptForAuthType';
import { validateAlksAccount } from '../validateAlksAccount';

export async function handleAlksDeveloperConfigure(
  options: commander.OptionValues
) {
  try {
    await setServer(options.server || (await promptForServer()));

    await setUserId(options.username || (await promptForUserId()));

    if (options.password && options.token) {
      throw new Error(
        'Invalid options: Cannot pass both -p/--password and -t/--token. Choose one or pass neither'
      );
    }

    // Prompt for auth type if none was chosen
    if (!(options.password || options.token)) {
      const authTypeAnswer = await promptForAuthType();
      options.token = authTypeAnswer === 'OAuth2 Refresh Token';
      options.password = !options.token;
    }

    if (options.token) {
      await saveToken(await promptForToken());
    } else {
      const password = await promptForPassword();
      const savePasswordAnswer = await confirm('Save password');
      if (savePasswordAnswer) {
        await savePassword(password);
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
    setOutputFormat(options.format || (await promptForOutputFormat()));

    // create developer
    console.error(clc.white('Your developer configuration has been updated.'));

    log('checking for update');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit('Error configuring developer: ' + err.message, err);
  }
}
