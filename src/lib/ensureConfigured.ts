import { isEmpty } from 'underscore';
import { getDeveloper } from './getDeveloper';

export let vAtSt: string | undefined;

export async function ensureConfigured() {
  const developer = await getDeveloper();
  if (!vAtSt) vAtSt = developer.lastVersion;

  // validate we have a valid configuration
  if (isEmpty(developer.server) || isEmpty(developer.userid)) {
    throw new Error(
      'ALKS CLI is not configured. Please run: alks developer configure'
    );
  }
}
