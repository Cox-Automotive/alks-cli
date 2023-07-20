import { Auth } from '../model/auth';
import { getAuth } from './getAuth';
import { getDeveloper } from './state/developer';
import { getServer } from './state/server';

export async function ensureConfigured(): Promise<void> {
  // validate we have a valid configuration
  // Note that we're explicitly checking the developer object instead of calling getServer and getUserId to ensure the developer object is configured
  const developer = await getDeveloper();
  if (!developer.server || !developer.userid) {
    return;
  }

  // If developer is not configured, ensure we at least have required variables configured
  if (!(await getAuthButDontThrow()) || !(await getServer())) {
    throw new Error(
      'ALKS CLI is not configured. Please run: `alks developer configure` or set the environment variables ALKS_USERID and ALKS_SERVER'
    );
  }
}

// TODO: make getAuth simply return Auth or undefined so we don't have to do this
async function getAuthButDontThrow(): Promise<Auth | undefined> {
  try {
    return await getAuth();
  } catch {
    return undefined;
  }
}
