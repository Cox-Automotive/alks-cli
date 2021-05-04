import { getDeveloper } from './getDeveloper';
import { getOutputValues } from './getOutputValues';
import { getStdErrPrompt } from './getStdErrPrompt';

export async function promptForOutputFormat(): Promise<string> {
  let developer;
  try {
    developer = await getDeveloper();
  } catch (err) {
    // ignore
  }

  const promptData = {
    type: 'list',
    name: 'outputFormat',
    default: developer?.outputFormat,
    message: 'Please select your default output format',
    choices: getOutputValues(),
    pageSize: 10,
  };

  const answers = await getStdErrPrompt()([promptData]);

  return answers.outputFormat;
}
