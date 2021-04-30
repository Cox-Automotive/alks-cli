import { getDbFile } from './getDbFile';
import loki from 'lokijs';

const db = new loki(getDbFile());

export async function getCollection<T extends object>(
  name: string
): Promise<Collection<T>> {
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
