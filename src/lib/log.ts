import commander from 'commander';
import { yellow } from 'cli-color';

let programCacher: commander.Command | undefined;

export function log(
  program: commander.Command | null,
  section: string,
  msg: string
) {
  if (program && !programCacher) programCacher = program; // so hacky!

  if (programCacher && programCacher.verbose) {
    console.error(yellow(['[', section, ']: ', msg].join('')));
  }
}
