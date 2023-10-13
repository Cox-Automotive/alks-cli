import { createInstance } from 'prop-ini';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';
import { Profile } from '../model/credentialsProfile';
import {
  accessKey,
  credentialProcess,
  managedBy,
  secretKey,
  sessionToken,
} from './awsCredentialsFileContstants';
import { sensitive } from './sensitive';

export function getProfile(
  profileName: string,
  showSensitiveValues: boolean = false
): Profile | undefined {
  const credFile = getAwsCredentialsFile();
  const propIni = createInstance();
  propIni.decode({ file: credFile });
  const profile = propIni.getData(profileName);

  // prop-ini returns an empty object if the section doesn't exist
  if (!profile || Object.keys(profile).length === 0) {
    return undefined;
  }

  return {
    name: profileName,
    [accessKey]: profile[accessKey],
    [secretKey]: showSensitiveValues
      ? profile[secretKey]
      : sensitive(profile[secretKey]),
    [sessionToken]: showSensitiveValues
      ? profile[sessionToken]
      : sensitive(profile[sessionToken]),
    [credentialProcess]: profile[credentialProcess],
    [managedBy]: profile[managedBy],
  };
}
