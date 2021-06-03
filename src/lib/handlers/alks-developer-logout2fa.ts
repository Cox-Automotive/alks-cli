import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { removeToken } from '../removeToken';
import { trackActivity } from '../trackActivity';

export async function handleAlksDeveloperLogout2fa(
  _options: commander.OptionValues,
  _program: commander.Command
) {
  if (removeToken()) {
    console.error(clc.white('Token removed!'));
  } else {
    console.error(clc.red.bold('Error removing token!'));
  }

  try {
    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
