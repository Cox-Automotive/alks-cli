import clc from 'cli-color';
import commander from 'commander';
import { isOsx } from '../isOsx';
import forever from 'forever';

export function handleAlksServerStop(
  _options: commander.OptionValues,
  _program: commander.Command
) {
  if (!isOsx()) {
    console.error(clc.red('The metadata server is only supported on OSX.'));
    process.exit(0);
  }

  console.error(clc.white('Stopping metadata server..'));

  forever.list(false, (_err: Error | null, list: unknown | null) => {
    if (list === null) {
      console.log(clc.white('Metadata server is not running.'));
    } else {
      forever.stopAll();
      console.log(clc.white('Metadata server stopped.'));
    }
  });
}
