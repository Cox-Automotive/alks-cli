import { promises as fsPromises } from 'fs';
const { readFile, writeFile, mkdir } = fsPromises;
import { join } from 'path';
import { homedir } from 'os';
import { parse, stringify } from 'ini';
import { log } from '../log';

export const ALKS_CONFIG_FOLDER = join(homedir(), '.alks-cli');
export const CREDENTIALS_FILE_PATH = join(ALKS_CONFIG_FOLDER, 'credentials');

export interface Credentials {
  password?: string;
  refresh_token?: string;
  credential_process?: string;
}

export async function getCredentials(): Promise<Credentials> {
  const credentialsFile = await readFile(CREDENTIALS_FILE_PATH, 'utf-8').catch(
    () => ''
  );
  log('contents: ' + credentialsFile);
  const credentials = parse(credentialsFile);
  credentials.default ??= {};
  return credentials.default;
}

export async function setCredentials(credentials: Credentials): Promise<void> {
  const fileContents = { default: credentials };
  const credentialsFile = stringify(fileContents);
  await mkdir(ALKS_CONFIG_FOLDER).catch(() => {});
  await writeFile(CREDENTIALS_FILE_PATH, credentialsFile, {
    encoding: 'utf-8',
    mode: 0o600,
  });
}
