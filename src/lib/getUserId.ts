import { OptionValues } from 'commander';
import { isEmpty } from 'underscore';
import { getDeveloper } from './getDeveloper';
import { getUserIdFromPrompt } from './getUserIdFromPrompt';
import { log } from './log';

const logger = 'developer';

export async function getUserId(
  cliOptions: OptionValues,
  prompt: boolean = true
) {
  if (cliOptions?.userid) {
    // first check userid from CLI argument
    log(cliOptions, logger, 'using userid from CLI arg');
    return cliOptions.userid;
  } else if (!isEmpty(process.env.ALKS_USERID)) {
    // then check for an environment variable
    log(cliOptions, logger, 'using userid from environment variable');
    return process.env.ALKS_USERID;
  } else {
    // then check for stored userid
    const developer = await getDeveloper();
    const userid = developer.userid;
    if (!isEmpty(userid)) {
      log(cliOptions, logger, 'using stored userid');
      return userid;
    } else if (prompt) {
      // otherwise prompt the user (if we have program)
      log(cliOptions, logger, 'no userid found, prompting user');
      return cliOptions ? getUserIdFromPrompt() : null;
    } else {
      throw new Error('No userid was configured');
    }
  }
}
