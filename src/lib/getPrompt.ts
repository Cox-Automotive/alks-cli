import { isEmpty } from 'underscore';
import { getStdErrPrompt } from './getStdErrPrompt';

export async function getPrompt(
  field: string,
  defaultValue: string | undefined,
  text: string,
  validator: ((str: string) => boolean | string) | null
): Promise<string> {
  const answers = await getStdErrPrompt()([
    {
      type: 'input',
      name: field,
      message: text,
      default: () => {
        return defaultValue;
      },
      validate: validator
        ? validator
        : (val) => {
            return !isEmpty(val)
              ? true
              : 'Please enter a value for ' + text + '.';
          },
    },
  ]);
  return answers[field];
}
