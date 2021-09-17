import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { getPassword, cachePassword } from './state/password';

export async function promptForPassword(): Promise<string> {
  const password = await getPassword();

  const answer = await getPasswordFromPrompt('Network Password', password);

  cachePassword(answer);

  return answer;
}
