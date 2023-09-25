import { createInstance } from 'prop-ini';
import { addNewLineToEof } from './addNewLineToEof';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';
import { managedBy } from './awsCredentialsFileContstants';

export function removeProfile(
  profile: string | undefined,
  force: boolean = false
) {
  const credFile = getAwsCredentialsFile();

  const propIni = createInstance();
  propIni.decode({ file: credFile });
  const profileName = profile || 'default';
  const section = propIni.getData(profileName);

  if (!force && section[managedBy] !== 'alks') {
    throw new Error('Profile is not managed by ALKS');
  }

  propIni.removeData(section);

  propIni.encode({ file: credFile });

  // propIni doesnt add a new line, so running aws configure will cause issues
  addNewLineToEof(credFile);

  return true;
}
