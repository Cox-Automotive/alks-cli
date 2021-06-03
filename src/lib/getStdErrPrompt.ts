import { createPromptModule } from 'inquirer';

export function getStdErrPrompt() {
  return createPromptModule({ output: process.stderr });
}
