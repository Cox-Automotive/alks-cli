import { CommanderError } from 'commander';
import { handleUnknownCommand } from './handleUnknownCommand';
import commander from 'commander';
import { log } from '../log';
import { errorAndExit } from '../errorAndExit';

function isCommanderError(err: any): err is CommanderError {
  return err.code !== undefined;
}

export function handleCommanderError(
  program: commander.Command,
  err: CommanderError | Error
): void {
  if (isCommanderError(err)) {
    log(err.code);
    switch (err.code) {
      case 'commander.unknownCommand': {
        return handleUnknownCommand(program);
      }
      case 'commander.help':
      case 'commander.version':
      case 'commander.helpDisplayed': {
        return; // Do nothing
      }
    }
  }
  errorAndExit(err.message, err);
}
