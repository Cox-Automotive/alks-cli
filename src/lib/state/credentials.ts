import { promises as fsPromises } from 'fs';
const { readFile, writeFile } = fsPromises;
import { join } from 'path';
import { parse, stringify } from 'ini';
import { log } from '../log';
import { getAlksConfigFolder } from '../folders';

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
  log('contents:\n' + credentialsFile, {
    unsafe: true,
    alt:
      'contents:\n' +
      credentialsFile.replace(/([^=\s\n]+)=.+\n/g, '$1=[REDACTED]\n'),
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
