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

  // Read current state first. getDeveloper internally calls getCollection, which
  // calls db.loadDatabase. If we obtained a collection reference *before* that,
  // LokiJS's loadJSONObject would reset db.collections and orphan our reference,
  // causing db.save to write stale data from disk instead of our updates.
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

  // We have to remove the LokiJS metadata fields so LokiJS won't complain that we're trying to insert an object that exists already
  // @ts-ignore
  delete developer.meta;
  // @ts-ignore
  delete developer.$loki;

  log(`saving ${JSON.stringify(developer)}`);

  // Obtain the collection AFTER reading state, so this reference is the live
  // one attached to db.collections after the most recent loadDatabase.
  const collection: Collection<Developer> = await getCollection('account');
  collection.clear();
  collection.insert(developer);

  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
