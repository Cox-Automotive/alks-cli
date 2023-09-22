import { closeSync, existsSync, mkdirSync, openSync } from 'fs';
import { getFilePathInHome } from './getFilePathInHome';

export function getAwsCredentialsFile() {
  const credPath = getFilePathInHome('.aws');
  const credFile = credPath + '/credentials';

  // in case the user never ran `aws configure`..
  if (!existsSync(credFile)) {
    if (!existsSync(credPath)) {
      mkdirSync(credPath);
    }
    closeSync(openSync(credFile, 'w'));
  }

  return credFile;
}
