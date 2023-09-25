import commander from 'commander';
import { getAllProfiles } from '../getAllProfiles';
import { red } from 'cli-color';

export async function handleAlksProfilesList(options: commander.OptionValues) {
  const profiles = getAllProfiles(options.all);

  if (profiles.length === 0) {
    console.error(red('No profiles found'));
  }

  switch (options.output) {
    case 'json': {
      console.log(JSON.stringify(profiles));
      break;
    }
    case 'list': {
      for (const profile of profiles) {
        console.log(profile.name);
      }
      break;
    }
    default: {
      throw new Error('Invalid output type');
    }
  }
}
