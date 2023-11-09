import commander from 'commander';
import { generateProfile } from '../generateProfile';
import { getAlksAccounts } from '../getAlksAccounts';
import { red } from 'cli-color';

export async function handleAlksProfilesGenerate(
  options: commander.OptionValues
) {
  if (options.all) {
    // Generate profiles for all account/role pairs

    const accounts = await getAlksAccounts();

    let profilesGenerated = 0;
    for (const account of accounts) {
      const accountName =
        account.skypieaAccount?.alias ?? account.account.substring(0, 12);
      try {
        generateProfile(
          accountName,
          account.role,
          `${accountName}-${account.role}`,
          options.force
        );
        profilesGenerated++;
      } catch (err) {
        console.error(
          red(
            `Error generating profile for ${accountName}-${account.role}: ${err}`
          )
        );
      }
    }

    console.error(
      `${profilesGenerated} profile${
        profilesGenerated == 1 ? '' : 's'
      } generated`
    );
  } else if (options.account) {
    // Generate a single profile

    if (!options.role) {
      throw new Error('role is required');
    }

    const profileName = options.profile ?? options.namedProfile;

    generateProfile(options.account, options.role, profileName, options.force);

    console.error(`Profile ${profileName} generated`);
  } else {
    throw new Error(
      'Either --all or --account and --role is required at a minimum'
    );
  }
}
