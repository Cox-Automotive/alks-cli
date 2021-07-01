import { getDeveloper } from './state/developer';

export let versionAtStart: string | undefined;

export async function ensureConfigured() {
  const developer = await getDeveloper();
  if (!versionAtStart) versionAtStart = developer.lastVersion;

  // validate we have a valid configuration
  // Note that we're explicitly checking the developer object instead of calling getServer and getUserId to ensure the developer object is configured
  if (!developer.server || !developer.userid) {
    throw new Error(
      'ALKS CLI is not configured. Please run: alks developer configure'
    );
  }
}
