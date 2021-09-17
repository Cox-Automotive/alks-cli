import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { parse, stringify } from 'ini';

export const CREDENTIALS_FILE_PATH = join(homedir(), '.alks', 'credentials');

export async function getCredentials(): Promise<Record<string, any>> {
  const credentialsFile = await readFile(CREDENTIALS_FILE_PATH, 'utf-8').catch(
    () => ''
  );
  const credentials = parse(credentialsFile);
  credentials.default ??= {};
  return credentials;
}

export async function setCredentials(
  credentials: Record<string, any>
): Promise<void> {
  const credentialsFile = stringify(credentials);
  await writeFile(CREDENTIALS_FILE_PATH, credentialsFile, {
    encoding: 'utf-8',
    mode: 0o600,
  });
}
