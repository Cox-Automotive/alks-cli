import { getPrompt } from './getPrompt';
import { getUserId } from './state/userId';

export async function promptForUserId(): Promise<string> {
  // Ignore failure since we're about to prompt for it
  const userId = await getUserId().catch(() => undefined);

  return getPrompt('userid', userId, 'Network Username', null);
}
