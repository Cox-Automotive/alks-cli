import { CommanderError } from 'commander';
import { handleUnknownCommand } from './handleUnknownCommand';
import commander from 'commander';
import { log } from '../log';
// import { getLastMatchingProgram } from '../getLastMatchingProgram';

export function handleCommanderError(
  program: commander.Command,
  err: CommanderError
) {
  log(program.opts(), 'handleCommanderError', err.code);

  if (err.code === 'commander.unknownCommand') {
    handleUnknownCommand(program);
    // } else if (program.commands.length) {
    //   const latestProgram = getLastMatchingProgram(program);
    //   try {
    //     latestProgram.help();
    //   } catch (err) {
    //     // do nothing
    //   }
  }
}
