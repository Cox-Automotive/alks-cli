import { white } from 'cli-color';
import commander from 'commander';
import { filter } from 'fuzzy';
import { includes, map } from 'underscore';
import { errorAndExit } from './errorAndExit';

export function subcommandSuggestion(
  program: commander.Command,
  subCommand: string
) {
  const commands = map(program.commands, '_name');

  if (program.args.length && !includes(commands, subCommand)) {
    const prefix = `alks ${subCommand}`;
    const msg = [prefix, subCommand, ' is not a valid ALKS command.'];
    const suggests = filter(subCommand, commands);
    const suggest = suggests.map((sug) => sug.string);

    if (suggest.length) {
      msg.push(white(' Did you mean '));
      msg.push(white.underline(prefix + suggest[0]));
      msg.push(white('?'));
    }

    errorAndExit(msg.join(''));
  }
}
