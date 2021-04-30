import commander from 'commander';
import { isEmpty } from 'underscore';
import { getPasswordFromKeystore } from './getPasswordFromKeystore';
import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { log } from './log';

const logger = 'password';

export async function getPassword(
  program: commander.Command | null,
  prompt: boolean = true
) {
  if (program && !isEmpty(program.password)) {
    // first check password from CLI argument
    log(program, logger, 'using password from CLI arg');
    return program.password;
  } else if (!isEmpty(process.env.ALKS_PASSWORD)) {
    // then check for an environment variable
    log(program, logger, 'using password from environment variable');
    return process.env.ALKS_PASSWORD;
  } else {
    // then check the keystore
    const password = await getPasswordFromKeystore();
    if (!isEmpty(password)) {
      log(program, logger, 'using password from keystore');
      return password;
    } else if (prompt) {
      // otherwise prompt the user (if we have program)
      log(program, logger, 'no password found, prompting user');
      return program ? getPasswordFromPrompt() : null;
    } else {
      throw new Error('No password was configured');
    }
  }
}
