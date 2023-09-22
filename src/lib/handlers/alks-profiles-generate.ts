import commander from 'commander';
import { generateProfile } from '../generateProfile';

export async function handleAlksProfilesGenerate(
  options: commander.OptionValues
) {
  if (options.all) {
    // Generate profiles for all account/role pairs

    throw new Error('Not implemented');
  } else if (options.account) {
    // Generate a single profile

    if (!options.role) {
      throw new Error('role is required');
    }

    generateProfile(
      options.account,
      options.role,
      options.profile ?? options.namedProfile,
      options.force
    );
  } else {
    throw new Error('Either --all or --account is required at a minimum');
  }
}
