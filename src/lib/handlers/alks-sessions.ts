import { subcommandSuggestion } from '../subcommandSuggestion';
import commander from 'commander';

export function handleAlksSessions(program: commander.Command) {
  subcommandSuggestion(program, 'sessions');
}
