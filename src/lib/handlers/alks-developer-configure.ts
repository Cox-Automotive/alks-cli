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

export async function handleAlksDeveloperConfigure(
  _options: commander.OptionValues
) {
  try {
    await setServer(await promptForServer());

    await setUserId(await promptForUserId());

    const password = await promptForPassword();
    const savePasswordAnswer = await confirm('Save password');
    if (savePasswordAnswer) {
      await savePassword(password);
    }

    log('Getting ALKS accounts');
    const { alksAccount, alksRole } = await promptForAlksAccountAndRole({
      prompt: 'Please select your default ALKS account/role',
    });
    await setAlksAccount(alksAccount);
    await setAlksRole(alksRole);

    log('Getting output formats');
    setOutputFormat(await promptForOutputFormat());

    // create developer
    console.error(clc.white('Your developer configuration has been updated.'));

    log('checking for update');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit('Error configuring developer: ' + err.message, err);
  }
}
