import { Metadata } from '../model/metadata';
import { getCollection } from './getCollection';
import { log } from './log';
import { getDb } from './db';

export async function saveMetadata(data: Metadata): Promise<void> {
  log('saving metadata');
  const md: Collection<Metadata> = await getCollection('metadata');
  md.removeDataOnly();

  md.insert(data);

  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.save((err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
