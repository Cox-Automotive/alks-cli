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

export function getProfile(
  profileName: string,
  hideSensitiveValues: boolean = true
): Profile | undefined {
  const credFile = getAwsCredentialsFile();
  const propIni = createInstance();
  propIni.decode({ file: credFile });
  const profile = propIni.getData(profileName);

  if (!profile) {
    return undefined;
  }

  return {
    name: profileName,
    [accessKey]: profile[accessKey],
    [secretKey]: hideSensitiveValues
      ? profile[secretKey]?.substring(0, 4) + '******'
      : profile[secretKey],
    [sessionToken]: hideSensitiveValues
      ? profile[sessionToken]?.substring(0, 4) + '******'
      : profile[sessionToken],
    [credentialProcess]: profile[credentialProcess],
    [managedBy]: profile[managedBy],
  };
}
