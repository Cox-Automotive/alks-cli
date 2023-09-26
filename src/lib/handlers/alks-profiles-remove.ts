import commander from 'commander';
import { getAllProfiles } from '../getAllProfiles';
import { removeProfile } from '../removeProfile';
import { confirm } from '../confirm';

export async function handleAlksProfilesRemove(
  options: commander.OptionValues
) {
  if (options.all) {
    const profiles = getAllProfiles();

    if (
      options.force ||
      (await confirm(
        `Are you sure you want to remove ${profiles.length} profiles?`
      ))
    ) {
      for (const profile of profiles) {
        console.error(`Removing profile: ${profile.name}`);
        removeProfile(profile.name, options.force);
      }

      console.error(
        `${profiles.length} profile${profiles.length === 1 ? '' : 's'} removed`
      );
    } else {
      throw new Error('Aborting');
    }
  } else {
    if (!(options.profile || options.namedProfile)) {
      throw new Error('Either --profile or --all is required');
    }
    const profileName = options.profile ?? options.namedProfile;

    if (
      options.force ||
      (await confirm(`Are you sure you want to remove ${profileName}?`))
    ) {
      removeProfile(profileName, options.force);
      console.error(`Profile ${profileName} removed`);
    } else {
      throw new Error('Aborting');
    }
  }
}
