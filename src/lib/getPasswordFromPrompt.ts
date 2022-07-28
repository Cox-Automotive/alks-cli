import { getStdErrPrompt } from './getStdErrPrompt';
import { log } from './log';
import { isEmpty } from 'underscore';
import { trim } from './trim';

export async function getPasswordFromPrompt(
  text?: string,
  currentPassword?: string
) {
  log('getting password from prompt');
  const answers = await getStdErrPrompt()([
    {
      type: 'password',
      name: 'password',
      message: text ? text : 'Password',
      default() {
        return isEmpty(currentPassword) ? '' : currentPassword;
      },
      validate(val) {
        return !isEmpty(val) ? true : 'Please enter a value for password.';
      },
    },
  ]);

  log(`received "${answers.password}"`, {
    unsafe: true,
    alt: `received input of ${
      answers.password.length
    } characters starting with "${answers.password.substring(0, 1)}"`,
  });

  return trim(answers.password);
}
