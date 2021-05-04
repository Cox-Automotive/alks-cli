import { getDeveloper } from './getDeveloper';
import { getPrompt } from './getPrompt';
import { isURL } from './isUrl';

export async function promptForServer(): Promise<string> {
  let developer;
  try {
    developer = await getDeveloper();
  } catch (e) {
    // ignore
  }

  return getPrompt('server', developer?.server, 'ALKS server', isURL);
}
