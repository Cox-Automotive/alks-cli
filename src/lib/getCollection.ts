import { getDb } from './db';

export async function getCollection<T extends object>(
  name: string
): Promise<Collection<T>> {
  return new Promise((resolve, reject) => {
    const db = getDb();

    db.loadDatabase({}, (err: Error) => {
      if (err) {
        reject(err);
        return;
      }

      const collection = db.getCollection(name) || db.addCollection(name);
      resolve(collection);
    });
  });
}
