import commander from 'commander';
import { subcommandSuggestion } from '../subcommandSuggestion';

export async function handleAlksIam(program: commander.Command) {
  subcommandSuggestion(program, 'iam');
}
