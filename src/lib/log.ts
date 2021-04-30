import { OptionValues } from 'commander';
import { yellow } from 'cli-color';

let cliOptionsCache: OptionValues | undefined;

export function log(
  cliOptions: OptionValues | null,
  section: string,
  msg: string
) {
  if (cliOptions || cliOptionsCache) {
    cliOptionsCache = {
      ...cliOptionsCache,
      ...cliOptions,
    };
  }

  if (cliOptionsCache?.verbose) {
    console.error(yellow(['[', section, ']: ', msg].join('')));
  }
}
