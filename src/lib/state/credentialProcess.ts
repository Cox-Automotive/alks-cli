import { getCredentials, setCredentials } from './credentials';

export async function getCredentialProcess(): Promise<string | undefined> {
  const credentials = await getCredentials();
  return credentials.credential_process;
}

export async function setCredentialProcess(
  credential_process: string
): Promise<void> {
  const credentials = await getCredentials();
  credentials.credential_process = credential_process;
  await setCredentials(credentials);
}
