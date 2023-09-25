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

export function getProfile(profileName: string): Profile | undefined {
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
    [secretKey]: profile[secretKey],
    [sessionToken]: profile[sessionToken],
    [credentialProcess]: profile[credentialProcess],
    [managedBy]: profile[managedBy],
  };
}
