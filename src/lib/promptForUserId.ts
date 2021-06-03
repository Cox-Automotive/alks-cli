import { getDeveloper } from './getDeveloper';
import { getPrompt } from './getPrompt';

export async function promptForUserId(): Promise<string> {
  let developer;
  try {
    developer = await getDeveloper();
  } catch (e) {
    // ignore
  }

  return getPrompt('userid', developer?.userid, 'Network Username', null);
}
