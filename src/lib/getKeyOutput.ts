import { red } from 'cli-color';
import moment from 'moment';
import { Key } from '../model/keys';
import { isWindows } from './isWindows';
import { updateCreds } from './updateCreds';

// if adding new output types be sure to update utils.js:getOutputValues
export function getKeyOutput(
  format: string,
  key: Key,
  profile: string | undefined,
  force: boolean | undefined
) {
  const keyExpires = moment(key.expires).format();

  switch (format) {
    case 'docker': {
      return `-e AWS_ACCESS_KEY_ID=${key.accessKey} -e AWS_SECRET_ACCESS_KEY=${key.secretKey} -e AWS_SESSION_TOKEN= ${key.sessionToken} -e AWS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'terraformarg': {
      return `-e ALKS_ACCESS_KEY_ID=${key.accessKey} -e ALKS_SECRET_ACCESS_KEY=${key.secretKey} -e ALKS_SESSION_TOKEN=${key.sessionToken} -e ALKS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'tarraformenv': {
      const cmd = isWindows() ? 'SET' : 'export';
      return `${cmd} ALKS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} ALKS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} ALKS_SESSION_TOKEN=${key.sessionToken} && ${cmd} ALKS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'json': {
      const keyData = {
        accessKey: key.accessKey,
        secretKey: key.secretKey,
        sessionToken: key.sessionToken,
        expires: key.expires, // This is the only format using the unformatted "key.expires". This may be a bug but I'm leaving it for the moment for backwards compatibility
      };
      return JSON.stringify(keyData, null, 4);
    }
    case 'creds': {
      if (updateCreds(key, profile, force)) {
        let msg = 'Your AWS credentials file has been updated';

        if (profile) {
          msg += ` with the named profile: ${profile}`;
        }

        return msg;
      } else {
        return red(
          `The ${profile} profile already exists in AWS credentials. Please pass -f to force overwrite.`
        );
      }
    }
    case 'idea': {
      return `AWS_ACCESS_KEY_ID=${key.accessKey}\nAWS_SECRET_ACCESS_KEY=${key.secretKey}\nAWS_SESSION_TOKEN=${key.sessionToken}\nAWS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'powershell': {
      return `$env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, $env:AWS_SESSION_TOKEN, $env:AWS_SESSION_EXPIRES = "${key.accessKey}","${key.secretKey}","${key.sessionToken}","${keyExpires}"`;
    }
    case 'fishshell': {
      return `set -xg AWS_ACCESS_KEY_ID '${key.accessKey}'; and set -xg AWS_SECRET_ACCESS_KEY '${key.secretKey}'; and set -xg AWS_SESSION_TOKEN '${key.sessionToken}'; and set -xg AWS_SESSION_EXPIRES '${keyExpires}';`;
    }
    case 'export': // fall through to case 'set'
    case 'set': {
      const cmd = format === 'export' ? 'export' : 'SET';

      return `${cmd} AWS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} AWS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} AWS_SESSION_TOKEN=${key.sessionToken} && ${cmd} AWS_SESSION_EXPIRES=${keyExpires}`;
    }
    case 'aws': {
      return JSON.stringify({
        Version: 1,
        AccessKeyId: key.accessKey,
        SecretAccessKey: key.secretKey,
        SessionToken: key.sessionToken,
        Expiration: moment(key.expires).toISOString(),
      });
    }
    default: {
      const cmd = isWindows() ? 'SET' : 'export';

      return `${cmd} AWS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} AWS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} AWS_SESSION_TOKEN=${key.sessionToken} && ${cmd} AWS_SESSION_EXPIRES=${keyExpires}`;
    }
  }
}
