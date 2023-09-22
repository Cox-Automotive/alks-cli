import { createInstance } from 'prop-ini';
import { has } from 'underscore';
import { addNewLineToEof } from './addNewLineToEof';
import { getAwsCredentialsFile } from './getAwsCredentialsFile';

const accessKey = 'aws_access_key_id';
const secretKey = 'aws_secret_access_key';
const sessionToken = 'aws_session_token';
const credentialProcess = 'credential_process';

export function generateProfile(
  accountId: string,
  role: string,
  profile: string | undefined,
  force: boolean | undefined
) {
  const credFile = getAwsCredentialsFile();
  const propIni = createInstance();
  const awsCreds = propIni.decode({ file: credFile });
  const section = profile || 'default';
  const credentialProcessCommand = `alks sessions open -a ${accountId} -r ${role} -o aws`;

  if (has(awsCreds.sections, section)) {
    if (force) {
      // overwrite only the relevant keys and leave the rest of the section untouched
      propIni.addData(credentialProcessCommand, section, credentialProcess);
      propIni.removeData(section, accessKey);
      propIni.removeData(section, secretKey);
      propIni.removeData(section, sessionToken);
    } else {
      throw new Error(
        `Profile ${section} already exists. Use --force to overwrite.`
      );
    }
  } else {
    // add brand new section
    const data = {
      [credentialProcess]: credentialProcessCommand,
    };

    propIni.addData(data, section);
  }

  propIni.encode({ file: credFile });

  // propIni doesnt add a new line, so running aws configure will cause issues
  addNewLineToEof(credFile);
}
