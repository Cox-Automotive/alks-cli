import { prompt } from 'inquirer';

export async function confirm(
  message: string,
  defaultAnswer: boolean = true
): Promise<boolean> {
  const answers = await prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message,
      default: defaultAnswer,
    },
  ]);
  return answers.confirmation;
}
