import { getPasswordFromKeystore } from './getPasswordFromKeystore';
import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { log } from './log';
import program from './program';

const logger = 'promptForPassword';

export async function promptForPassword(): Promise<string> {
  log(program, logger, 'getting existing password');
  const password = await getPasswordFromKeystore();

  return getPasswordFromPrompt('Network Password', password);
}
