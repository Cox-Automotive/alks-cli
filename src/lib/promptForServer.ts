import { getPrompt } from './getPrompt';
import { isURL } from './isUrl';
import { getServer } from './state/server';

export const defaultServer = 'https://alks.coxautoinc.com/rest';

export async function promptForServer(): Promise<string> {
  // Ignore failure since we're about to prompt for it
  const server = await getServer();

  return getPrompt('server', server || defaultServer, 'ALKS server', isURL);
}
