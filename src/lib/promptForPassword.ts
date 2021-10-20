import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { getSecretFromStdin } from './getSecretFromStdin';
import { getPassword, cachePassword } from './state/password';

export async function promptForPassword(): Promise<string> {
  let answer = await getSecretFromStdin();

  // Only prompt if no password was provided via stdin
  if (!answer) {
    const password = await getPassword();
    answer = await getPasswordFromPrompt('Network Password', password);
  }

  cachePassword(answer);

  return answer;
}
