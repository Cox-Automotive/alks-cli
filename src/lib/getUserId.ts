import commander from 'commander';
import { isEmpty } from 'underscore';
import { getDeveloper } from './getDeveloper';
import { getUserIdFromPrompt } from './getUserIdFromPrompt';
import { log } from './log';

const logger = 'developer';

export async function getUserId(
  program: commander.Command,
  prompt: boolean = true
) {
  if (program && !isEmpty(program.userid)) {
    // first check userid from CLI argument
    log(program, logger, 'using userid from CLI arg');
    return program.userid;
  } else if (!isEmpty(process.env.ALKS_USERID)) {
    // then check for an environment variable
    log(program, logger, 'using userid from environment variable');
    return process.env.ALKS_USERID;
  } else {
    // then check for stored userid
    const developer = await getDeveloper();
    const userid = developer.userid;
    if (!isEmpty(userid)) {
      log(program, logger, 'using stored userid');
      return userid;
    } else if (prompt) {
      // otherwise prompt the user (if we have program)
      log(program, logger, 'no userid found, prompting user');
      return program ? getUserIdFromPrompt() : null;
    } else {
      throw new Error('No userid was configured');
    }
  }
}
