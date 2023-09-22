import commander from 'commander';
import { getAlksAccounts } from '../getAlksAccounts';

export async function handleAlksProfilesGenerate(
  _options: commander.OptionValues
) {
  const accounts = getAlksAccounts();

  throw new Error('Not implemented');
}
