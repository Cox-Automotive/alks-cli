import { getOutputValues } from './getOutputValues';
import { getStdErrPrompt } from './getStdErrPrompt';
import { getOutputFormat } from './state/outputFormat';

export async function promptForOutputFormat(): Promise<string> {
  const outputFormat = await getOutputFormat();

  const promptData = {
    type: 'list',
    name: 'outputFormat',
    default: outputFormat,
    message: 'Please select your default output format',
    choices: getOutputValues(),
    pageSize: 10,
  };

  const answers = await getStdErrPrompt()([promptData]);

  return answers.outputFormat;
}
