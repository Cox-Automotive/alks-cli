import { Key } from '../model/keys';
import { createInstance } from 'prop-ini';
import { has } from 'underscore';
import { readFileSync, writeFileSync } from 'fs';
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
  key: Key,
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

  // Write changeNumber as a comment above the profile section if present
  if (key.changeNumber) {
    const fileContent = readFileSync(credFile, 'utf-8');
    const sectionHeader = `[${section}]`;
    const commentLine = `# ALKS_CHANGE_NUMBER=${key.changeNumber}`;

    // Find the section header and insert the comment before it
    const sectionIndex = fileContent.indexOf(sectionHeader);
    if (sectionIndex !== -1) {
      const modifiedContent =
        fileContent.slice(0, sectionIndex) +
        commentLine +
        '\n' +
        fileContent.slice(sectionIndex);
      writeFileSync(credFile, modifiedContent, 'utf-8');
    }
  }

  // propIni doesnt add a new line, so running aws configure will cause issues
  addNewLineToEof(credFile);

  return true;
}
