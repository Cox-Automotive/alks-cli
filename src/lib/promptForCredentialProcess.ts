import { getPrompt } from './getPrompt';
import { getCredentialProcess } from './state/credentialProcess';
import { white } from 'cli-color';

export async function promptForCredentialProcess(): Promise<string> {
  const credentialProcess = await getCredentialProcess();

  console.log(
    white(
      'For information on using credential_process scripts, see https://github.com/Cox-Automotive/alks-cli/wiki/Credential-Process-Scripts'
    )
  );
  return getPrompt(
    'scriptPath',
    credentialProcess,
    'Path to your script',
    null
  );
}
