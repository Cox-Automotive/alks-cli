import { getPasswordFromKeystore } from './getPasswordFromKeystore';
import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { log } from './log';

export async function promptForPassword(): Promise<string> {
  log('getting existing password');
  const password = await getPasswordFromKeystore();

  return getPasswordFromPrompt('Network Password', password);
}
