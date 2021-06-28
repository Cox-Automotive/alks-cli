import { getPrompt } from './getPrompt';
import { isURL } from './isUrl';
import { getServer } from './state/server';

export async function promptForServer(): Promise<string> {
  // Ignore failure since we're about to prompt for it
  const server = await getServer().catch(() => undefined);

  return getPrompt('server', server || undefined, 'ALKS server', isURL);
}
