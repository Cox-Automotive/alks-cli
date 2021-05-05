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
) {
  if (isCommanderError(err)) {
    log(err.code);
    if (err.code === 'commander.unknownCommand') {
      handleUnknownCommand(program);
    }
  }
  errorAndExit(err.message, err);
}
