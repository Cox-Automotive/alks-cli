import { createPromptModule } from 'inquirer';
import AutocompletePrompt from 'inquirer-autocomplete-prompt';

export function getStdErrPrompt() {
  const prompt = createPromptModule({ output: process.stderr });
  prompt.registerPrompt('autocomplete', AutocompletePrompt);
  return prompt;
}
