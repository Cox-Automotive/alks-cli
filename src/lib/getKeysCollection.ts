import { Key } from '../model/keys';
import { getDb } from './db';

export async function getKeysCollection(): Promise<Collection<Key>> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    // have the DB load from disk
    db.loadDatabase({}, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      // grab the keys collection (if its null this is a new run, create the collection)
      const keys =
        db.getCollection('keys') ||
        db.addCollection('keys', { indices: ['expires'] });

      resolve(keys);
    });
  });
}
