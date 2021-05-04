import { prompt } from 'inquirer';

export async function confirm(message: string): Promise<boolean> {
  const answers = await prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message,
    },
  ]);
  return answers.confirmation;
}
