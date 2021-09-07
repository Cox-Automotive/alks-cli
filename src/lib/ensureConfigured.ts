import { getDeveloper } from './state/developer';
import { getServer } from './state/server';
import { getUserId } from './state/userId';

export async function ensureConfigured(): Promise<void> {
  // validate we have a valid configuration
  // Note that we're explicitly checking the developer object instead of calling getServer and getUserId to ensure the developer object is configured
  const developer = await getDeveloper();
  if (!developer.server || !developer.userid) {
    return;
  }

  // If developer is not configured, ensure we at least have required variables configured
  if (!(await getUserId()) || !(await getServer())) {
    throw new Error(
      'ALKS CLI is not configured. Please run: alks developer configure'
    );
  }
}
