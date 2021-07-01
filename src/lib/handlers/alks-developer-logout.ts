import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { removePassword } from '../removePassword';
import { trackActivity } from '../trackActivity';

export async function handleAlksDeveloperLogout(
  _options: commander.OptionValues
) {
  if (removePassword()) {
    console.error(clc.white('Password removed!'));
  } else {
    console.error(clc.red.bold('Error removing password!'));
  }

  try {
    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
