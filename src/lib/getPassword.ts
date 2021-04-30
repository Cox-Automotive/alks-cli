import { OptionValues } from 'commander';
import { isEmpty } from 'underscore';
import { getPasswordFromKeystore } from './getPasswordFromKeystore';
import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { log } from './log';

const logger = 'password';

export async function getPassword(
  cliOptions: OptionValues | null,
  prompt: boolean = true
) {
  if (cliOptions?.password) {
    // first check password from CLI argument
    log(cliOptions, logger, 'using password from CLI arg');
    return cliOptions.password;
  } else if (!isEmpty(process.env.ALKS_PASSWORD)) {
    // then check for an environment variable
    log(cliOptions, logger, 'using password from environment variable');
    return process.env.ALKS_PASSWORD;
  } else {
    // then check the keystore
    const password = await getPasswordFromKeystore();
    if (password) {
      log(cliOptions, logger, 'using password from keystore');
      return password;
    } else if (prompt) {
      // otherwise prompt the user (if we have program)
      log(cliOptions, logger, 'no password found, prompting user');
      return cliOptions ? getPasswordFromPrompt() : null;
    } else {
      throw new Error('No password was configured');
    }
  }
}
