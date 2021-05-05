import { CommanderError } from 'commander';
import { handleUnknownCommand } from './handleUnknownCommand';
import commander from 'commander';
import { log } from '../log';

export function handleCommanderError(
  program: commander.Command,
  err: CommanderError
) {
  log(err.code);

  if (err.code === 'commander.unknownCommand') {
    handleUnknownCommand(program);
  }
}
