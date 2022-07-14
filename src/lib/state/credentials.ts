import { promises as fsPromises } from 'fs';
const { readFile, writeFile } = fsPromises;
import { join } from 'path';
import { parse, stringify } from 'ini';
import { log } from '../log';
import { getAlksConfigFolder } from '../configFolder';

export function getCredentialsFilePath() {
  return join(getAlksConfigFolder(), 'credentials');
}

export interface Credentials {
  password?: string;
  refresh_token?: string;
  credential_process?: string;
}

export async function getCredentials(): Promise<Credentials> {
  const credentialsFile = await readFile(
    getCredentialsFilePath(),
    'utf-8'
  ).catch(() => '');
  log('contents: ' + credentialsFile, {
    unsafe: true,
    alt: credentialsFile.replace(/([^=]+)=.+/g, '[REDACTED]'),
  });
  const credentials = parse(credentialsFile);
  credentials.default ??= {};
  return credentials.default;
}

export async function setCredentials(credentials: Credentials): Promise<void> {
  const fileContents = { default: credentials };
  const credentialsFile = stringify(fileContents);
  await writeFile(getCredentialsFilePath(), credentialsFile, {
    encoding: 'utf-8',
    mode: 0o600,
  });
}
