import { isEmpty } from 'underscore';
import { getStdErrPrompt } from './getStdErrPrompt';
import { log } from './log';
import { trim } from './trim';

const logger = 'getUserIdFromPrompt';

export async function getUserIdFromPrompt(
  text?: string,
  currentUserid?: string
) {
  log(null, logger, 'getting userid from prompt');
  const answers = await getStdErrPrompt()([
    {
      type: 'input',
      name: 'userid',
      message: text ? text : 'Network Username',
      default() {
        return isEmpty(currentUserid) ? '' : currentUserid;
      },
      validate(val) {
        return !isEmpty(val)
          ? true
          : 'Please enter a value for network username.';
      },
    },
  ]);

  return trim(answers.userid);
}
