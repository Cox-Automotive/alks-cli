import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { removeToken } from '../removeToken';
import { trackActivity } from '../tractActivity';

export async function handleAlksDeveloperLogout2fa(
  _options: commander.OptionValues,
  program: commander.Command
) {
  const logger = 'dev-logout2fa';

  if (removeToken()) {
    console.error(clc.white('Token removed!'));
  } else {
    console.error(clc.red.bold('Error removing token!'));
  }

  try {
    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
