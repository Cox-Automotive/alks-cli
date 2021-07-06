import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { getPassword, cachePassword } from './state/password';

export async function promptForPassword(): Promise<string> {
  // Ignore failure since we're about to prompt for it
  const password = await getPassword().catch(() => undefined);

  const answer = await getPasswordFromPrompt('Network Password', password);

  cachePassword(answer);

  return answer;
}
