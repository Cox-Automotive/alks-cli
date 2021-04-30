import { subcommandSuggestion } from '../subcommandSuggestion';
import commander from 'commander';

export function handleAlksServer(program: commander.Command) {
  subcommandSuggestion(program, 'server');
}
