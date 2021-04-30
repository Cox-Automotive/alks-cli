import commander from 'commander';
import { subcommandSuggestion } from '../subcommandSuggestion';

export async function handleAlksDeveloper(program: commander.Command) {
  subcommandSuggestion(program, 'developer');
}
