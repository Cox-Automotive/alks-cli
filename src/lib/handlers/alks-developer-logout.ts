import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { removePassword } from '../removePassword';
import { trackActivity } from '../tractActivity';

export async function handleAlksDeveloperLogout(
  _options: commander.OptionValues,
  program: commander.Command
) {
  const logger = 'dev-logout';

  if (removePassword()) {
    console.error(clc.white('Password removed!'));
  } else {
    console.error(clc.red.bold('Error removing password!'));
  }

  try {
    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
