import commander from 'commander';
import fuzzy from 'fuzzy';
import { errorAndExit } from '../errorAndExit';
import { white } from 'cli-color';
import { getLastMatchingProgram } from '../getLastMatchingProgram';

export function handleUnknownCommand(program: commander.Command) {
  if (!program.args.length) {
    errorAndExit(
      'handleUnknownCommand was called but there are no arguments to process'
    );
  }

  const command = getLastMatchingProgram(program);
  const commandNames = command.commands.map((c) => c.name());
  const prefixArgs = [];
  const args = ['alks', ...program.args];
  let arg;
  while ((arg = args.shift())) {
    prefixArgs.push(arg);
    if (arg == command.name()) {
      break;
    }
  }
  const unknownCommand = args.shift() as string;
  const prefix = prefixArgs.join(' ');

  const msg = [unknownCommand, ' is not a valid ALKS command.'];
  const suggests = fuzzy.filter(unknownCommand, commandNames);
  const suggest = suggests.map((sug) => sug.string);

  if (suggest.length) {
    msg.push(white(' Did you mean '));
    msg.push(white.underline(prefix + ' ' + suggest[0]));
    msg.push(white('?'));
  }

  errorAndExit(msg.join(''));
}
