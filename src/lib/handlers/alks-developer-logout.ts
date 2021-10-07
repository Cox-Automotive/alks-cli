import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { log } from '../log';
import { removePassword } from '../removePassword';

export async function handleAlksDeveloperLogout(
  _options: commander.OptionValues
) {
  try {
    await removePassword();
    console.error(clc.white('Password removed!'));
  } catch (e) {
    log((e as Error).message);
    console.error(clc.red.bold('Error removing password!'));
  }

  try {
    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
