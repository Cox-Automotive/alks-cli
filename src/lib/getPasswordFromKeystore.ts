import { getKeytar } from './getKeytar';

const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

export async function getPasswordFromKeystore(): Promise<string | undefined> {
  const keytar = await getKeytar();
  return (
    (await keytar.getPassword(SERVICE, ALKS_USERID).catch(() => undefined)) ??
    undefined
  );
}
