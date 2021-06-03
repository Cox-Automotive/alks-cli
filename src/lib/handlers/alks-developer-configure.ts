import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { confirm } from '../confirm';
import { errorAndExit } from '../errorAndExit';
import { getAlksAccount } from '../getAlksAccount';
import { cacheAuth } from '../getAuth';
import { log } from '../log';
import { promptForOutputFormat } from '../promptForOutputFormat';
import { promptForPassword } from '../promptForPassword';
import { promptForServer } from '../promptForServer';
import { promptForUserId } from '../promptForUserId';
import { saveDeveloper } from '../saveDeveloper';
import { savePassword } from '../savePassword';
import { trackActivity } from '../trackActivity';

export async function handleAlksDeveloperConfigure(
  _options: commander.OptionValues,
  program: commander.Command
) {
  try {
    const server = await promptForServer();

    const userId = await promptForUserId();

    log('getting password');
    const password = await promptForPassword();

    const savePasswordAnswer = await confirm('Save password');
    if (savePasswordAnswer) {
      await savePassword(password);
    }

    // Cache password in program object for faster lookup
    cacheAuth({
      userid: userId,
      password,
    });

    log('Getting ALKS accounts');
    const { alksAccount, alksRole } = await getAlksAccount(program, {
      prompt: 'Please select your default ALKS account/role',
      server,
    });

    log('Getting output formats');
    const outputFormat = await promptForOutputFormat();

    // create developer
    log('saving developer');
    try {
      await saveDeveloper({
        server,
        userid: userId,
        alksAccount,
        alksRole,
        outputFormat,
      });
      console.error(
        clc.white('Your developer configuration has been updated.')
      );
    } catch (e2) {
      log('error saving! ' + e2.message);
      console.error(
        clc.red.bold(
          'There was an error updating your developer configuration.'
        )
      );
    }

    log('checking for update');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit('Error configuring developer: ' + err.message, err);
  }
}
