import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { removeToken } from '../removeToken';

export async function handleAlksDeveloperLogout2fa(
  _options: commander.OptionValues
) {
  try {
    await removeToken();
    console.error(clc.white('Token removed!'));
  } catch (e) {
    log((e as Error).message);
    console.error(clc.red.bold('Error removing token!'));
  }

  try {
    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
