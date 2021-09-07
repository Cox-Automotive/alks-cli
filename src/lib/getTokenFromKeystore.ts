import { getKeytar } from './getKeytar';

const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';

export async function getTokenFromKeystore(): Promise<string | undefined> {
  const keytar = await getKeytar();
  return (
    (await keytar.getPassword(SERVICE, ALKS_TOKEN).catch(() => undefined)) ??
    undefined
  );
}
