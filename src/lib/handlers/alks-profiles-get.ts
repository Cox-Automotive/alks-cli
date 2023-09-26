import commander from 'commander';
import { getProfile } from '../getProfile';

export async function handleAlksProfilesGet(options: commander.OptionValues) {
  if (!(options.profile || options.namedProfile)) {
    throw new Error('profile is required');
  }

  if (options.showSensitiveValues) {
    console.error(
      'WARNING: Sensitive values will be shown in output. Do not share this output with anyone.'
    );
  }

  const profileName = options.profile ?? options.namedProfile;

  const profile = getProfile(profileName, options.showSensitiveValues);

  if (!profile) {
    throw new Error(`Profile ${profileName} does not exist`);
  }

  switch (options.output) {
    case 'json': {
      console.log(JSON.stringify(profile));
      break;
    }
    case 'text': {
      console.log(`[${profile.name}]`);
      for (const [key, value] of Object.entries(profile)) {
        if (key === 'name') {
          continue;
        }
        console.log(`${key}=${value}`);
      }
      break;
    }
    default: {
      throw new Error('Invalid output type');
    }
  }
}
