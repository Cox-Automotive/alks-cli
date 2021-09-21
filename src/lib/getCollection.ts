import { getDb } from './db';

export async function getCollection<T extends object>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
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
