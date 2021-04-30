import { getStdErrPrompt } from './getStdErrPrompt';
import { log } from './log';
import { isEmpty } from 'underscore';
import { trim } from './trim';

const logger = 'password';

export async function getPasswordFromPrompt(
  text?: string,
  currentPassword?: string
) {
  log(null, logger, 'getting password from prompt');
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

  return trim(answers.password);
}
