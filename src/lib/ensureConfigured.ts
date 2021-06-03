import { getDeveloper } from './getDeveloper';

export let versionAtStart: string | undefined;

export async function ensureConfigured() {
  const developer = await getDeveloper();
  if (!versionAtStart) versionAtStart = developer.lastVersion;

  // validate we have a valid configuration
  if (!developer.server || !developer.userid) {
    throw new Error(
      'ALKS CLI is not configured. Please run: alks developer configure'
    );
  }
}
