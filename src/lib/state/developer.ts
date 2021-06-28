import { log } from '../log';
import { trim } from '../trim';
import { Developer } from '../../model/developer';
import { getCollection } from '../getCollection';
import { getDb } from '../db';

export async function getDeveloper(): Promise<Developer> {
  const collection: Collection<Developer> = await getCollection('account');

  const developerConfigs = collection.chain().data();

  const developer: Developer =
    developerConfigs.length > 0 ? developerConfigs[0] : ({} as Developer);

  return developer;
}

export async function updateDeveloper(newDeveloper: Developer): Promise<void> {
  log('saving developer');
  const collection: Collection<Developer> = await getCollection('account');

  collection.removeDataOnly();

  const developer = await getDeveloper();

  if (newDeveloper.server) {
    developer.server = trim(newDeveloper.server);
  }

  if (newDeveloper.userid) {
    developer.userid = trim(newDeveloper.userid);
  }

  if (newDeveloper.alksAccount) {
    developer.alksAccount = trim(newDeveloper.alksAccount);
  }

  if (newDeveloper.alksRole) {
    developer.alksRole = trim(newDeveloper.alksRole);
  }

  if (newDeveloper.lastVersion) {
    developer.lastVersion = newDeveloper.lastVersion;
  }

  if (newDeveloper.outputFormat) {
    developer.outputFormat = trim(newDeveloper.outputFormat);
  }

  collection.insert(developer);

  return new Promise((resolve, reject) => {
    getDb().save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
