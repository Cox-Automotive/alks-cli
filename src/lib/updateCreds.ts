import { closeSync, existsSync, mkdirSync, openSync } from 'fs';
import { AwsKey } from '../model/keys';
import { getFilePathInHome } from './getFilePathInHome';
import { createInstance } from 'prop-ini';
import { has } from 'underscore';
import { addNewLineToEof } from './addNewLineToEof';

export function updateCreds(
  key: AwsKey,
  profile: string | undefined,
  force: boolean | undefined
) {
  const credPath = getFilePathInHome('.aws');
  const credFile = credPath + '/credentials';

  // in case the user never ran `aws configure`..
  if (!existsSync(credFile)) {
    if (!existsSync(credPath)) {
      mkdirSync(credPath);
    }
    closeSync(openSync(credFile, 'w'));
  }

  const propIni = createInstance();
  const awsCreds = propIni.decode({ file: credFile });
  const section = profile || 'default';
  const accessKey = 'aws_access_key_id';
  const secretKey = 'aws_secret_access_key';
  const sessToken = 'aws_session_token';

  if (has(awsCreds.sections, section)) {
    if (force) {
      // overwrite only the relevant keys and leave the rest of the section untouched
      propIni.addData(key.accessKey, section, accessKey);
      propIni.addData(key.secretKey, section, secretKey);
      propIni.addData(key.sessionToken, section, sessToken);
    } else {
      return false;
    }
  } else {
    // add brand new section
    const data = {
      accessKey: key.accessKey,
      secretKey: key.secretKey,
      sessToken: key.sessionToken,
    };

    propIni.addData(data, section);
  }

  propIni.encode({ file: credFile });

  // propIni doesnt add a new line, so running aws configure will cause issues
  addNewLineToEof(credFile);

  return true;
}
