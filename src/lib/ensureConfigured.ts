import { getDeveloper } from './state/developer';
import { getPassword } from './state/password';
import { getServer } from './state/server';
import { getToken } from './state/token';
import { getUserId } from './state/userId';

export async function ensureConfigured(): Promise<void> {
  // validate we have a valid configuration
  // Note that we're explicitly checking the developer object instead of calling getServer and getUserId to ensure the developer object is configured
  const developer = await getDeveloper();
  if (!developer.server || !developer.userid) {
    return;
  }

  // If developer is not configured, ensure we at least have required variables configured
  try {
    await getUserId();
    await getServer();

    // Ensure either password or token is set
    try {
      await getPassword();
    } catch (e2) {
      await getToken();
    }
  } catch (e) {
    throw new Error(
      'ALKS CLI is not configured. Please run: `alks developer configure` or set the environment variables ALKS_USERID and ALKS_SERVER'
    );
  }
}
