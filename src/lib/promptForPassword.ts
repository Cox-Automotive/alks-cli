import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { getPassword } from './state/password';

export async function promptForPassword(): Promise<string> {
  // Ignore failure since we're about to prompt for it
  const password = await getPassword().catch(() => undefined);

  return getPasswordFromPrompt('Network Password', password);
}
