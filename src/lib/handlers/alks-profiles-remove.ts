import commander from 'commander';
import { getAllProfiles } from '../getAllProfiles';
import { removeProfile } from '../removeProfile';

export async function handleAlksProfilesRemove(
  options: commander.OptionValues
) {
  if (options.all) {
    const profiles = getAllProfiles();

    for (const profile of profiles) {
      console.error(`Removing profile: ${profile.name}`);
      removeProfile(profile.name, options.force);
    }

    console.error(
      `${profiles.length} profile${profiles.length === 1 ? '' : 's'} removed`
    );
  } else {
    if (!(options.profile || options.namedProfile)) {
      throw new Error('profile is required');
    }

    const profileName = options.profile ?? options.namedProfile;

    removeProfile(profileName, options.force);
    console.error(`Profile ${profileName} removed`);
  }
}
