import commander from 'commander';
import { getAllProfiles } from '../getAllProfiles';
import { red } from 'cli-color';

export async function handleAlksProfilesList(options: commander.OptionValues) {
  const profiles = getAllProfiles(options.all, options.showSensitiveValues);

  if (profiles.length === 0) {
    console.error(red('No profiles found'));
    return;
  }

  if (options.showSensitiveValues) {
    console.error(
      'WARNING: Sensitive values will be shown in output. Do not share this output with anyone.'
    );
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
