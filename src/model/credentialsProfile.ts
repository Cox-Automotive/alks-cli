import {
  accessKey,
  credentialProcess,
  managedBy,
  secretKey,
  sessionToken,
} from '../lib/awsCredentialsFileContstants';

export interface Profile {
  name: string;
  [accessKey]?: string;
  [secretKey]?: string;
  [sessionToken]?: string;
  [credentialProcess]?: string;
  [managedBy]?: string;
}
