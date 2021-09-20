import { spawnSync } from 'child_process';
import { log } from './log';
import { getCredentials } from './state/credentials';

export interface CredentialProcessResult {
  password?: string;
  refresh_token?: string;
}

let cachedResult: CredentialProcessResult | undefined;

export async function getCredentialsFromProcess(): Promise<CredentialProcessResult> {
  let result: CredentialProcessResult = {};
  if (cachedResult) {
    return cachedResult;
  }

  const credentials = await getCredentials();
  if (credentials.credential_process) {
    const output = spawnSync(credentials.credential_process);
    if (output.error) {
      log(
        'error encountered when executing credential process: ' + output.error
      );
      throw output.error;
    }
    if (String(output.stderr).trim().length > 0) {
      log('credential_process stderr: ' + output.stderr);
    }
    result = JSON.parse(String(output.stdout)) as CredentialProcessResult;
  } else {
    log('no credential_process found');
  }

  cachedResult = result;
  return result;
}
