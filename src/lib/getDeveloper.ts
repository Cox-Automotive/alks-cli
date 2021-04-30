import { Developer } from '../model/developer';
import { getCollection } from './getCollection';

export async function getDeveloper(): Promise<Developer> {
  const collection: Collection<Developer> = await getCollection('account');

  const developerConfigs = collection.chain().data();
  if (developerConfigs.length === 0) {
    throw new Error(
      'Developer not configured. Please run `alks developer configure`'
    );
  }
  const developer = developerConfigs[0];

  if (process.env.ALKS_SERVER) {
    developer.server = process.env.ALKS_SERVER;
  }
  if (process.env.ALKS_USERID) {
    developer.userid = process.env.ALKS_USERID;
  }
  return developer;
}
