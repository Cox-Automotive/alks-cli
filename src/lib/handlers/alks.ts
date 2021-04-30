import clc from 'cli-color';
import commander from 'commander';
import { head, includes, map } from 'underscore';
import { errorAndExit } from '../errorAndExit';
import pkg from '../../../package.json';
import fuzzy from 'fuzzy';

export function handleAlks(program: commander.Command) {
  if (process.stdout.isTTY) {
    console.error(clc.whiteBright.bold('ALKS v%s'), pkg.version);
  }

  const commands = map(program.commands, '_name');
  const requestedCommand = head(program.args) as string;

  if (!program.args.length) {
    program.help();
  } else if (!includes(commands, requestedCommand)) {
    const msg = [requestedCommand, ' is not a valid ALKS command.'];
    const suggests = fuzzy.filter(requestedCommand, commands);
    const suggest = suggests.map((sug) => sug.string);

    if (suggest.length) {
      msg.push(clc.white(' Did you mean '));
      msg.push(clc.white.underline(suggest[0]));
      msg.push(clc.white('?'));
    }

    errorAndExit(msg.join(''));
  }
}
