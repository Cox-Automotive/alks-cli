import { AwsKey } from '../model/keys';
import { createInstance } from 'prop-ini';
import { has } from 'underscore';
import { addNewLineToEof } from './addNewLineToEof';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';

const accessKey = 'aws_access_key_id';
const secretKey = 'aws_secret_access_key';
const sessionToken = 'aws_session_token';
const credentialProcess = 'credential_process';

export function updateCreds(
  key: AwsKey,
  profile: string | undefined,
  force: boolean | undefined
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
    } else {
      return false;
    }
  } else {
    // add brand new section
    const data = {
      [accessKey]: key.accessKey,
      [secretKey]: key.secretKey,
      [sessionToken]: key.sessionToken,
    };

    propIni.addData(data, section);
  }

  propIni.encode({ file: credFile });

  // propIni doesnt add a new line, so running aws configure will cause issues
  addNewLineToEof(credFile);

  return true;
}
