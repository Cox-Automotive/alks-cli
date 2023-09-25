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

// This roughly models the result of decoding the credentials file with prop-ini
interface AwsCredsStructure {
  sections: {
    [key: string]: {
      [accessKey]?: string;
      [secretKey]?: string;
      [sessionToken]?: string;
      [credentialProcess]?: string;
      [managedBy]?: string;
    };
  };
}

export function getAllProfiles(
  includeNonAlksProfiles: boolean = false,
  hideSensitiveValues: boolean = true
): Profile[] {
  const credFile = getAwsCredentialsFile();
  const propIni = createInstance();
  const awsCreds = propIni.decode({ file: credFile }) as AwsCredsStructure;
  const sections = awsCreds.sections;

  const result: Profile[] = Object.entries(sections)
    .filter(
      ([_name, section]) =>
        includeNonAlksProfiles || section[managedBy] === 'alks'
    )
    .map(([name, section]) => ({
      name,
      [accessKey]: section[accessKey],
      [secretKey]: hideSensitiveValues
        ? section[secretKey]?.substring(0, 4) + '******'
        : section[secretKey],
      [sessionToken]: hideSensitiveValues
        ? section[sessionToken]?.substring(0, 4) + '******'
        : section[sessionToken],
      [credentialProcess]: section[credentialProcess],
      [managedBy]: section[managedBy],
    }));

  return result;
}
