import { AwsKey } from '../model/keys';
import { createInstance } from 'prop-ini';
import { has } from 'underscore';
import { addNewLineToEof } from './addNewLineToEof';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';
import {
  accessKey,
  credentialProcess,
  managedBy,
  secretKey,
  sessionToken,
} from './awsCredentialsFileContstants';

export function updateCreds(
  key: AwsKey,
  profile: string | undefined,
  force: boolean = false
) {
  const credFile = getAwsCredentialsFile();

  const propIni = createInstance();
  const awsCreds = propIni.decode({ file: credFile });
  const section = profile || 'default';

  if (has(awsCreds.sections, section)) {
    if (force) {
      // overwrite only the relevant keys and leave the rest of the section untouched
      propIni.removeData(section, credentialProcess);
      propIni.addData(key.accessKey, section, accessKey);
      propIni.addData(key.secretKey, section, secretKey);
      propIni.addData(key.sessionToken, section, sessionToken);
      propIni.addData('alks', section, managedBy);
    } else {
      return false;
    }
  } else {
    // add brand new section
    const data = {
      [accessKey]: key.accessKey,
      [secretKey]: key.secretKey,
      [sessionToken]: key.sessionToken,
      [managedBy]: 'alks',
    };

    propIni.addData(data, section);
  }

  propIni.encode({ file: credFile });

  // propIni doesnt add a new line, so running aws configure will cause issues
  addNewLineToEof(credFile);

  return true;
}
